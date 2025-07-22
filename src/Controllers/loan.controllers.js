import LoanForm from "../models/Loan.model.js";

// loan request submit form
const createLoanForm = async (req, res) => {
  try {
    const { applicantInfo, loanDetails, guardians } = req.body;

    // Check for all required applicant fields
    const requiredApplicantFields = [
      "fullName",
      "fatherName",
      "cnic",
      "dateOfBirth",
      "gender",
      "email",
      "phone",
      "address",
      "city",
    ];

    for (const field of requiredApplicantFields) {
      if (!applicantInfo?.[field]) {
        return res
          .status(400)
          .json({ error: `Applicant ${field} is required.` });
      }
    }

    // Check for all required loan details
    const requiredLoanFields = [
      "loanType",
      "loanPurpose",
      "loanAmount",
      "durationMonths",
      "minDeposit",
      "monthlyInstalment",
    ];

    for (const field of requiredLoanFields) {
      if (!loanDetails?.[field]) {
        return res.status(400).json({ error: `${field} is required.` });
      }
    }

    // Guardians: should be exactly 2
    if (!Array.isArray(guardians) || guardians.length !== 2) {
      return res
        .status(400)
        .json({ error: "Exactly 2 guardians are required." });
    }

    // Validate each guardian
    for (let i = 0; i < guardians.length; i++) {
      const g = guardians[i];
      const requiredGuardianFields = [
        "fullName",
        "relation",
        "email",
        "phone",
        "cnic",
        "Dob",
        "address",
      ];
      for (const field of requiredGuardianFields) {
        if (!g?.[field]) {
          return res
            .status(400)
            .json({ error: `Guardian ${i + 1} ${field} is required.` });
        }
      }
    }

    // Save to DB
    const newLoanForm = new LoanForm({
      applicantInfo,
      loanDetails,
      guardians,
    });

    await newLoanForm.save();
    res.status(201).json({ message: "Loan form submitted successfully." });
  } catch (error) {
    console.error("Create loan form error:", error);
    res.status(500).json({ error: "Server error while creating loan form." });
  }
};

// view all form request
const viewFormRequest = async (req, res) => {
  try {
    const getAllForm = await LoanForm.find({});
    res.status(200).json({ message: "Successfully Fetch", getAllForm });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// total stats on loan appliation
const getLoanFormStats = async (req, res) => {
  try {
    const total = await LoanForm.countDocuments();
    const pending = await LoanForm.countDocuments({ status: "pending" });
    const approved = await LoanForm.countDocuments({ status: "approved" });
    const rejected = await LoanForm.countDocuments({ status: "rejected" });
    return res.status(200).json({
      success: true,
      data: {
        total,
        pending,
        approved,
        rejected,
      },
    });
  } catch (error) {
    console.error("Error in getLoanFormStats:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while fetching stats",
    });
  }
};

// Update status (approve, reject, pending)
const updateLoanStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  const validStatuses = ["approved", "rejected", "pending"];
  if (!validStatuses.includes(status)) {
    return res.status(400).json({ message: "Invalid status value" });
  }
  try {
    const updatedForm = await LoanForm.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );
    if (!updatedForm) {
      return res.status(404).json({ message: "Loan application not found" });
    }
    return res.status(200).json({
      message: `Loan application marked as ${status}`,
      updatedForm,
    });
  } catch (error) {
    console.error("Error updating status:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

// get single application
const getSingleApplication = async (req, res) => {
  const { id } = req.params;
  // 1. Validate ID format
  if (!id.match(/^[0-9a-fA-F]{24}$/)) {
    return res.status(400).json({ message: "Invalid application ID" });
  }
  try {
    const application = await LoanForm.findById(id);
    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }
    res.status(200).json(application);
  } catch (error) {
    console.error("Error fetching application:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
export {
  createLoanForm,
  viewFormRequest,
  getLoanFormStats,
  updateLoanStatus,
  getSingleApplication,
};
