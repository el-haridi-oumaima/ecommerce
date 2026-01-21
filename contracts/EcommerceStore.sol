// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract EcommerceStore {
    
    // Structures
    struct User {
        address userAddress;
        string name;
        UserRole role;
        bool isRegistered;
        uint256 createdAt;
        uint256 totalPurchases;
        uint256 totalEarnings;
    }
    
    struct Product {
        uint256 id;
        string name;
        string description;
        uint256 price;
        uint256 stock;
        address payable seller;
        bool isActive;
        string imageUrl;
        uint256 createdAt;
        uint256 totalSales;
        uint256 rating;
        uint256 totalReviews;
    }
    
    struct Order {
        uint256 id;
        uint256 productId;
        address buyer;
        address seller;
        uint256 quantity;
        uint256 totalPrice;
        OrderStatus status;
        uint256 timestamp;
        bool isReviewed;
    }
    
    struct CartItem {
        uint256 productId;
        uint256 quantity;
    }
    
    struct Review {
        uint256 productId;
        address reviewer;
        uint256 rating;
        string comment;
        uint256 timestamp;
    }
    
    // Enums
    enum UserRole { Client, Seller, Admin }
    enum OrderStatus { Pending, Confirmed, Shipped, Delivered, Cancelled }
    
    // State variables
    address public admin;
    uint256 public productCounter;
    uint256 public orderCounter;
    uint256 public totalTransactionVolume;
    
    mapping(address => User) public users;
    mapping(uint256 => Product) public products;
    mapping(uint256 => Order) public orders;
    mapping(address => uint256[]) public userOrders;
    mapping(address => uint256[]) public sellerProducts;
    mapping(address => CartItem[]) public userCart;
    mapping(address => uint256[]) public userPurchaseHistory;
    mapping(uint256 => Review[]) public productReviews;
    
    // Events
    event UserRegistered(address indexed userAddress, string name, UserRole role);
    event ProductAdded(uint256 indexed productId, string name, uint256 price, address indexed seller);
    event ProductUpdated(uint256 indexed productId, string name, uint256 price);
    event OrderCreated(uint256 indexed orderId, uint256 indexed productId, address indexed buyer, uint256 quantity);
    event OrderStatusUpdated(uint256 indexed orderId, OrderStatus status);
    event PaymentReceived(address indexed from, uint256 amount);
    event CartItemAdded(address indexed user, uint256 productId, uint256 quantity);
    event CartItemRemoved(address indexed user, uint256 productId);
    event CartCleared(address indexed user);
    event ReviewAdded(uint256 indexed productId, address indexed reviewer, uint256 rating);
    event OrderCancelled(uint256 indexed orderId);
    
    // Modifiers
    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin can perform this action");
        _;
    }
    
    modifier onlyRegistered() {
        require(users[msg.sender].isRegistered, "User not registered");
        _;
    }
    
    modifier onlySeller() {
        require(users[msg.sender].role == UserRole.Seller || users[msg.sender].role == UserRole.Admin, "Only sellers can perform this action");
        _;
    }
    
    constructor() {
        admin = msg.sender;
        users[admin] = User(admin, "Admin", UserRole.Admin, true, block.timestamp, 0, 0);
        
        // Ajout d'un produit initial
        productCounter++;
        products[productCounter] = Product(
            productCounter,
            "Livre Blockchain",
            "Apprendre Solidity et la blockchain",
            0.1 ether,
            100,
            payable(admin),
            true,
            "https://via.placeholder.com/150",
            block.timestamp,
            0,
            0,
            0
        );
        sellerProducts[admin].push(productCounter);
    }
    
    // User Management
    function registerUser(string memory _name, UserRole _role) public {
        require(!users[msg.sender].isRegistered, "User already registered");
        require(_role != UserRole.Admin, "Cannot register as admin");
        
        users[msg.sender] = User(
            msg.sender,
            _name,
            _role,
            true,
            block.timestamp,
            0,
            0
        );
        emit UserRegistered(msg.sender, _name, _role);
    }
    
    function getUser(address _userAddress) public view returns (User memory) {
        return users[_userAddress];
    }
    
    // Product Management
    function addProduct(
        string memory _name,
        string memory _description,
        uint256 _price,
        uint256 _stock,
        string memory _imageUrl
    ) public onlyRegistered onlySeller {
        require(_price > 0, "Price must be greater than 0");
        require(_stock > 0, "Stock must be greater than 0");
        
        productCounter++;
        products[productCounter] = Product(
            productCounter,
            _name,
            _description,
            _price,
            _stock,
            payable(msg.sender),
            true,
            _imageUrl,
            block.timestamp,
            0,
            0,
            0
        );
        
        sellerProducts[msg.sender].push(productCounter);
        emit ProductAdded(productCounter, _name, _price, msg.sender);
    }
    
    function updateProduct(
        uint256 _productId,
        string memory _name,
        string memory _description,
        uint256 _price,
        uint256 _stock,
        string memory _imageUrl
    ) public {
        Product storage product = products[_productId];
        require(product.seller == msg.sender, "Only product owner can update");
        require(_price > 0, "Price must be greater than 0");
        
        product.name = _name;
        product.description = _description;
        product.price = _price;
        product.stock = _stock;
        product.imageUrl = _imageUrl;
        
        emit ProductUpdated(_productId, _name, _price);
    }
    
    function toggleProductStatus(uint256 _productId) public {
        Product storage product = products[_productId];
        require(product.seller == msg.sender || msg.sender == admin, "Not authorized");
        
        product.isActive = !product.isActive;
    }
    
    function getProduct(uint256 _productId) public view returns (Product memory) {
        return products[_productId];
    }
    
    function getAllProducts() public view returns (Product[] memory) {
        Product[] memory allProducts = new Product[](productCounter);
        for (uint256 i = 1; i <= productCounter; i++) {
            allProducts[i - 1] = products[i];
        }
        return allProducts;
    }
    
    function getSellerProducts(address _seller) public view returns (uint256[] memory) {
        return sellerProducts[_seller];
    }
    
    // Order Management
    function createOrder(uint256 _productId, uint256 _quantity) public payable onlyRegistered {
        Product storage product = products[_productId];
        User storage user = users[msg.sender];
        
        require(product.isActive, "Product is not active");
        require(product.stock >= _quantity, "Insufficient stock");
        require(_quantity > 0, "Quantity must be greater than 0");
        
        uint256 totalPrice = product.price * _quantity;
        require(msg.value >= totalPrice, "Insufficient payment");
        
        // Update stock
        product.stock -= _quantity;
        product.totalSales += _quantity;
        
        // Create order
        orderCounter++;
        orders[orderCounter] = Order(
            orderCounter,
            _productId,
            msg.sender,
            product.seller,
            _quantity,
            totalPrice,
            OrderStatus.Pending,
            block.timestamp,
            false
        );
        
        userOrders[msg.sender].push(orderCounter);
        userPurchaseHistory[msg.sender].push(orderCounter);
        user.totalPurchases += totalPrice;
        
        // Update seller earnings
        User storage seller = users[product.seller];
        seller.totalEarnings += totalPrice;
        
        // Transfer payment to seller
        product.seller.transfer(totalPrice);
        
        // Refund excess payment
        if (msg.value > totalPrice) {
            payable(msg.sender).transfer(msg.value - totalPrice);
        }
        
        totalTransactionVolume += totalPrice;
        
        // Clear cart
        delete userCart[msg.sender];
        
        emit OrderCreated(orderCounter, _productId, msg.sender, _quantity);
        emit PaymentReceived(msg.sender, totalPrice);
    }
    
    function updateOrderStatus(uint256 _orderId, OrderStatus _status) public {
        Order storage order = orders[_orderId];
        require(
            order.seller == msg.sender || msg.sender == admin,
            "Only seller or admin can update order status"
        );
        
        order.status = _status;
        emit OrderStatusUpdated(_orderId, _status);
    }
    
    function getOrder(uint256 _orderId) public view returns (Order memory) {
        return orders[_orderId];
    }
    
    function getUserOrders(address _user) public view returns (uint256[] memory) {
        return userOrders[_user];
    }
    
    function getAllOrders() public view returns (Order[] memory) {
        Order[] memory allOrders = new Order[](orderCounter);
        for (uint256 i = 1; i <= orderCounter; i++) {
            allOrders[i - 1] = orders[i];
        }
        return allOrders;
    }
    
    // Statistics
    function getTotalProducts() public view returns (uint256) {
        return productCounter;
    }
    
    function getTotalOrders() public view returns (uint256) {
        return orderCounter;
    }
    
    // Cart Management
    function addToCart(uint256 _productId, uint256 _quantity) public onlyRegistered {
        require(products[_productId].isActive, "Product not active");
        require(_quantity > 0, "Quantity must be > 0");
        
        CartItem[] storage cart = userCart[msg.sender];
        bool found = false;
        
        for (uint i = 0; i < cart.length; i++) {
            if (cart[i].productId == _productId) {
                cart[i].quantity += _quantity;
                found = true;
                break;
            }
        }
        
        if (!found) {
            cart.push(CartItem(_productId, _quantity));
        }
        
        emit CartItemAdded(msg.sender, _productId, _quantity);
    }
    
    function removeFromCart(uint256 _productId) public onlyRegistered {
        CartItem[] storage cart = userCart[msg.sender];
        
        for (uint i = 0; i < cart.length; i++) {
            if (cart[i].productId == _productId) {
                cart[i] = cart[cart.length - 1];
                cart.pop();
                break;
            }
        }
        
        emit CartItemRemoved(msg.sender, _productId);
    }
    
    function getCart(address _user) public view returns (CartItem[] memory) {
        return userCart[_user];
    }
    
    function clearCart() public onlyRegistered {
        delete userCart[msg.sender];
        emit CartCleared(msg.sender);
    }
    
    function getCartTotal(address _user) public view returns (uint256) {
        CartItem[] memory cart = userCart[_user];
        uint256 total = 0;
        
        for (uint i = 0; i < cart.length; i++) {
            total += products[cart[i].productId].price * cart[i].quantity;
        }
        
        return total;
    }
    
    // Review Management
    function addReview(uint256 _productId, uint256 _rating, string memory _comment) public onlyRegistered {
        require(products[_productId].id != 0, "Product does not exist");
        require(_rating > 0 && _rating <= 5, "Rating must be between 1 and 5");
        require(bytes(_comment).length > 0, "Comment cannot be empty");
        
        // Check if user bought this product
        bool hasPurchased = false;
        for (uint i = 0; i < userPurchaseHistory[msg.sender].length; i++) {
            if (orders[userPurchaseHistory[msg.sender][i]].productId == _productId) {
                hasPurchased = true;
                break;
            }
        }
        require(hasPurchased, "You must purchase this product to review it");
        
        productReviews[_productId].push(Review(_productId, msg.sender, _rating, _comment, block.timestamp));
        
        Product storage product = products[_productId];
        product.rating = (product.rating + _rating) / 2;
        product.totalReviews++;
        
        emit ReviewAdded(_productId, msg.sender, _rating);
    }
    
    function getProductReviews(uint256 _productId) public view returns (Review[] memory) {
        return productReviews[_productId];
    }
    
    function cancelOrder(uint256 _orderId) public {
        Order storage order = orders[_orderId];
        require(order.buyer == msg.sender || msg.sender == admin, "Not authorized");
        require(order.status == OrderStatus.Pending, "Cannot cancel delivered order");
        
        order.status = OrderStatus.Cancelled;
        
        // Refund buyer
        payable(order.buyer).transfer(order.totalPrice);
        
        // Restore stock
        products[order.productId].stock += order.quantity;
        
        emit OrderCancelled(_orderId);
    }
}