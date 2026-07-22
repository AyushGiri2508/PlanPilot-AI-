const Goal = require("../models/Goal");
const Task = require("../models/Task");
const Schedule = require("../models/Schedule");

const { runWorkflow } = require("../services/aiWorkflowService");
const { recoverSchedule } = require("../services/agents/recoveryAgent");

const generatePlan = async (req, res) => {
  try {
    const { goalId } = req.params;

    const result = await runWorkflow(goalId);

    return res.status(200).json({
      success: true,
      message: "AI plan generated successfully.",
      data: result,
    });

  } catch (error) {

    return res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};

const regeneratePlan = async (req, res) => {

    try{

        const {goalId}=req.params;

        await Task.deleteMany({
            goal:goalId,
            aiGenerated:true
        });

        await Schedule.deleteMany({
            goal:goalId,
            aiGenerated:true
        });

        const result=await runWorkflow(goalId);

        res.status(200).json({
            success:true,
            message:"Plan regenerated successfully.",
            data:result
        });

    }

    catch(error){

        res.status(500).json({
            success:false,
            message:error.message
        });

    }

};

const recoverPlan = async (req, res) => {

    try{

        const {goalId}=req.params;

        const goal=await Goal.findById(goalId);

        if(!goal){

            return res.status(404).json({
                success:false,
                message:"Goal not found."
            });

        }

        const pendingTasks=await Task.find({
            goal:goalId,
            status:{$ne:"Completed"}
        });

        const completedTasks=await Task.find({
            goal:goalId,
            status:"Completed"
        });

        const schedule=await recoverSchedule(
            goal,
            pendingTasks,
            completedTasks
        );

        return res.status(200).json({

            success:true,
            schedule

        });

    }

    catch(error){

        return res.status(500).json({

            success:false,
            message:error.message

        });

    }

};
module.exports={

    generatePlan,
    regeneratePlan,
    recoverPlan

};