const { trainersCollection } = require("../models/trainerModel");

// Create a new trainer
const createTrainer = async (req, res) => {
  const { name, specialty, assignedClasses, contactInfo } = req.body;

  try {
    // Create a new trainer document in Firestore
    const newTrainer = await trainersCollection.add({
      name,
      specialty,
      assignedClasses,
      contactInfo,
      createdAt: new Date(),
    });

    res.status(201).json({
      message: "Trainer created successfully",
      trainerId: newTrainer.id,
    });
  } catch (error) {
    console.error("Error creating trainer:", error);
    res.status(500).json({ error: "Failed to create trainer" });
  }
};

// Get all trainers with optional search and filtering by specialty
const getTrainers = async (req, res) => {
  const { page = 1, limit = 10, specialty, search = "" } = req.query;

  try {
    let query = trainersCollection.orderBy("createdAt").offset((page - 1) * limit).limit(limit);

    if (specialty) {
      query = query.where("specialty", "==", specialty);
    }

    if (search) {
      query = query.where("name", ">=", search).where("name", "<=", search + "\uf8ff"); // Fuzzy search
    }

    const snapshot = await query.get();

    const trainers = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));

    res.status(200).json(trainers);
  } catch (error) {
    console.error("Error fetching trainers:", error);
    res.status(500).json({ error: "Failed to fetch trainers" });
  }
};

// Update a trainer's information
const updateTrainer = async (req, res) => {
  const { trainerId } = req.params;
  const { name, specialty, assignedClasses, contactInfo } = req.body;

  try {
    // Update the trainer's data in Firestore
    const trainerRef = trainersCollection.doc(trainerId);
    await trainerRef.update({
      name,
      specialty,
      assignedClasses,
      contactInfo,
      updatedAt: new Date(),
    });

    res.status(200).json({ message: "Trainer updated successfully" });
  } catch (error) {
    console.error("Error updating trainer:", error);
    res.status(500).json({ error: "Failed to update trainer" });
  }
};

// Delete a trainer by ID
const deleteTrainer = async (req, res) => {
  const { trainerId } = req.params;

  try {
    // Delete the trainer from Firestore
    await trainersCollection.doc(trainerId).delete();

    res.status(200).json({ message: "Trainer deleted successfully" });
  } catch (error) {
    console.error("Error deleting trainer:", error);
    res.status(500).json({ error: "Failed to delete trainer" });
  }
};

module.exports = { createTrainer, getTrainers, updateTrainer, deleteTrainer };
