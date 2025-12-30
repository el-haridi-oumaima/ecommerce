// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract EcommerceStore {
    
    // Structures
    struct User {
        address userAddress;
        string name;
        UserRole role;
        bool isRegistered;
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
    }
    
    // Enums
    enum UserRole { Client, Seller, Admin }
    enum OrderStatus { Pending, Confirmed, Shipped, Delivered, Cancelled }
    
    // State variables
    address public admin;
    uint256 public productCounter;
    uint256 public orderCounter;
    
    mapping(address => User) public users;
    mapping(uint256 => Product) public products;
    mapping(uint256 => Order) public orders;
    mapping(address => uint256[]) public userOrders;
    mapping(address => uint256[]) public sellerProducts;
    
    // Events
    event UserRegistered(address indexed userAddress, string name, UserRole role);
    event ProductAdded(uint256 indexed productId, string name, uint256 price, address indexed seller);
    event ProductUpdated(uint256 indexed productId, string name, uint256 price);
    event OrderCreated(uint256 indexed orderId, uint256 indexed productId, address indexed buyer, uint256 quantity);
    event OrderStatusUpdated(uint256 indexed orderId, OrderStatus status);
    event PaymentReceived(address indexed from, uint256 amount);
    
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
    // On enregistre l'admin aussi comme vendeur pour le test
    users[admin] = User(admin, "Admin", UserRole.Admin, true);
    
    // Ajout d'un produit initial pour que React trouve quelque chose
    productCounter++;
    products[productCounter] = Product(
        productCounter,
        "Livre Blockchain",
        "Apprendre Solidity",
        0.1 ether,
        100,
        payable(admin),
        true,
        "https://via.placeholder.com/150"
    );
}
    
    // User Management
    function registerUser(string memory _name, UserRole _role) public {
        require(!users[msg.sender].isRegistered, "User already registered");
        require(_role != UserRole.Admin, "Cannot register as admin");
        
        users[msg.sender] = User(msg.sender, _name, _role, true);
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
            _imageUrl
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
        
        require(product.isActive, "Product is not active");
        require(product.stock >= _quantity, "Insufficient stock");
        require(_quantity > 0, "Quantity must be greater than 0");
        
        uint256 totalPrice = product.price * _quantity;
        require(msg.value >= totalPrice, "Insufficient payment");
        
        // Update stock
        product.stock -= _quantity;
        
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
            block.timestamp
        );
        
        userOrders[msg.sender].push(orderCounter);
        
        // Transfer payment to seller
        product.seller.transfer(totalPrice);
        
        // Refund excess payment
        if (msg.value > totalPrice) {
            payable(msg.sender).transfer(msg.value - totalPrice);
        }
        
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
}