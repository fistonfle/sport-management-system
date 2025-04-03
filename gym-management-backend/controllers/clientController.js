const { clientsCollection } = require("../models/clientModel");

// Create a new client
const createClient = async (req, res) => {
  const { name, membershipType, status, joinDate } = req.body;

  try {
    // Create a new client document in Firestore
    const newClient = await clientsCollection.add({
      name,
      membershipType,
      status,
      joinDate,
      createdAt: new Date(),
    });

    res.status(201).json({
      message: "Client created successfully",
      clientId: newClient.id,
    });
  } catch (error) {
    console.error("Error creating client:", error);
    res.status(500).json({ error: "Failed to create client" });
  }
};

// Get all clients with optional search and filtering by membership type/status
const getClients = async (req, res) => {
  const { page = 1, limit = 10, membershipType, status, search = "" } = req.query;

  try {
    let query = clientsCollection.orderBy("createdAt").offset((page - 1) * limit).limit(limit);

    if (membershipType) {
      query = query.where("membershipType", "==", membershipType);
    }

    if (status) {
      query = query.where("status", "==", status);
    }

    if (search) {
      query = query.where("name", ">=", search).where("name", "<=", search + "\uf8ff"); // Fuzzy search
    }

    const snapshot = await query.get();

    const clients = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));

    res.status(200).json(clients);
  } catch (error) {
    console.error("Error fetching clients:", error);
    res.status(500).json({ error: "Failed to fetch clients" });
  }
};

// Update a client's information
const updateClient = async (req, res) => {
  const { clientId } = req.params;
  const { name, membershipType, status, joinDate } = req.body;

  try {
    // Update the client's data in Firestore
    const clientRef = clientsCollection.doc(clientId);
    await clientRef.update({
      name,
      membershipType,
      status,
      joinDate,
      updatedAt: new Date(),
    });

    res.status(200).json({ message: "Client updated successfully" });
  } catch (error) {
    console.error("Error updating client:", error);
    res.status(500).json({ error: "Failed to update client" });
  }
};

// Delete a client by ID
const deleteClient = async (req, res) => {
  const { clientId } = req.params;

  try {
    // Delete the client from Firestore
    await clientsCollection.doc(clientId).delete();

    res.status(200).json({ message: "Client deleted successfully" });
  } catch (error) {
    console.error("Error deleting client:", error);
    res.status(500).json({ error: "Failed to delete client" });
  }
};

module.exports = { createClient, getClients, updateClient, deleteClient };
