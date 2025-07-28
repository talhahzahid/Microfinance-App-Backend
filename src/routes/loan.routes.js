import express from "express";
import {
  createLoanForm,
  getLoanFormStats,
  getSingleApplication,
  updateLoanStatus,
  viewFormRequest,
} from "../Controllers/loan.controllers.js";

const router = express.Router();

router.post("/addLoan", createLoanForm);

router.get("/viewRequest", viewFormRequest);
router.get("/loanform/stats", getLoanFormStats);
router.put("/loanform/status/:id", updateLoanStatus);
router.get("/loanform/:id", getSingleApplication);

export default router;
