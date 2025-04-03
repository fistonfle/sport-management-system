const { packagesCollection } = require("../models/packageModel");

// Create a new package
const createPackage = async (req, res) => {
  const { name, price, duration, description } = req.body;

  try {
    // Create a new package in Firestore
    const newPackage = await packagesCollection.add({
      name,
      price,
      duration,
      description,
      createdAt: new Date(),
    });

    res.status(201).json({
      message: "Package created successfully",
      packageId: newPackage.id,
    });
  } catch (error) {
    console.error("Error creating package:", error);
    res.status(500).json({ error: "Failed to create package" });
  }
};

// Get all packages with pagination
const getPackages = async (req, res) => {
  const { page = 1, limit = 10 } = req.query; // Default to page 1 and limit 10

  try {
    const snapshot = await packagesCollection
      .orderBy("createdAt")
      .offset((page - 1) * limit) // Pagination logic
      .limit(limit)
      .get();

    const packages = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));

    res.status(200).json(packages);
  } catch (error) {
    console.error("Error fetching packages:", error);
    res.status(500).json({ error: "Failed to fetch packages" });
  }
};

// Update a package by ID
const updatePackage = async (req, res) => {
  const { packageId } = req.params;
  const { name, price, duration, description } = req.body;

  try {
    // Update the package in Firestore
    const packageRef = packagesCollection.doc(packageId);
    await packageRef.update({
      name,
      price,
      duration,
      description,
      updatedAt: new Date(),
    });

    res.status(200).json({ message: "Package updated successfully" });
  } catch (error) {
    console.error("Error updating package:", error);
    res.status(500).json({ error: "Failed to update package" });
  }
};

// Delete a package by ID
const deletePackage = async (req, res) => {
  const { packageId } = req.params;

  try {
    // Delete the package from Firestore
    await packagesCollection.doc(packageId).delete();

    res.status(200).json({ message: "Package deleted successfully" });
  } catch (error) {
    console.error("Error deleting package:", error);
    res.status(500).json({ error: "Failed to delete package" });
  }
};

module.exports = { createPackage, getPackages, updatePackage, deletePackage };
