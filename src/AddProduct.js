import { useState } from "react";

function AddProduct({ contract, account }) {
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    image: ""
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const addProduct = async (e) => {
    e.preventDefault();

    await contract.methods.addProduct(
      form.name,
      form.description,
      window.web3.utils.toWei(form.price, "ether"),
      form.stock,
      form.image
    ).send({ from: account });

    alert("Produit ajouté avec succès !");
  };

  return (
    <div style={{ padding: "30px" }}>
      <h2>➕ Ajouter un produit</h2>

      <form onSubmit={addProduct}>
        <input name="name" placeholder="Nom" onChange={handleChange} required /><br />
        <input name="description" placeholder="Description" onChange={handleChange} required /><br />
        <input name="price" placeholder="Prix (ETH)" onChange={handleChange} required /><br />
        <input name="stock" placeholder="Stock" onChange={handleChange} required /><br />
        <input name="image" placeholder="URL image" onChange={handleChange} required /><br /><br />

        <button type="submit">Ajouter</button>
      </form>
    </div>
  );
}

export default AddProduct;
