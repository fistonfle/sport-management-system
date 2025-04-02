const { classesCollection } = require('../models/classModel');

// Create a new class
exports.createClass = async (req, res) => {
  try {
    const { name, description, trainer, schedule } = req.body;

    // Validate required fields
    if (!name || !description || !trainer || !schedule) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    // Add a new class to Firestore
    const newClass = await classesCollection.add({
      name,
      description,
      trainer,
      schedule
    });

    res.status(201).json({ message: 'Class created successfully', classId: newClass.id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get all classes
exports.getAllClasses = async (req, res) => {
  try {
    const snapshot = await classesCollection.get();
    const classes = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.status(200).json(classes);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get a class by ID
exports.getClassById = async (req, res) => {
  try {
    const classId = req.params.id;
    const classDoc = await classesCollection.doc(classId).get();

    if (!classDoc.exists) {
      return res.status(404).json({ message: 'Class not found' });
    }

    res.status(200).json({ id: classDoc.id, ...classDoc.data() });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update a class by ID
exports.updateClass = async (req, res) => {
  try {
    const classId = req.params.id;
    const { name, description, trainer, schedule } = req.body;

    // Validate required fields
    if (!name || !description || !trainer || !schedule) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    const classRef = classesCollection.doc(classId);
    const classDoc = await classRef.get();
    if (!classDoc.exists) {
      return res.status(404).json({ message: 'Class not found' });
    }

    await classRef.update({
      name,
      description,
      trainer,
      schedule
    });

    res.status(200).json({ message: 'Class updated successfully', classId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete a class by ID
exports.deleteClass = async (req, res) => {
  try {
    const classId = req.params.id;
    const classRef = classesCollection.doc(classId);
    
    const classDoc = await classRef.get();
    if (!classDoc.exists) {
      return res.status(404).json({ message: 'Class not found' });
    }

    await classRef.delete();
    res.status(200).json({ message: 'Class deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};
