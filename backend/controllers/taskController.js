const Task = require("../models/Task");

const getTasks = async (req, res) => {
    try {
        const { search = "", status = "all", page = 1, limit = 6 } = req.query;
        const query = {
            userId: req.user._id
        };
        //Search filter — if a search term is provided, it adds a $or condition that checks if either the title or description field matches the search term. The $regex with $options: "i" makes it case-insensitive.
        if (search) {
            query.$or = [
                {
                    title: { $regex: search, $options: "i" }
                },
                { description: { $regex: search, $options: "i" } }
            ]
        }

        if (status !== "all") {
            query.status = status;
        }

        const pageNumber = Number(page);
        const limitNumber = Number(limit);
        const skip = (pageNumber - 1) * limitNumber;

        const totalTasks = await Task.countDocuments(query);

        const tasks = await Task.find(query)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limitNumber);

        res.status(200).json({
            tasks,
            currentPage: pageNumber,
            totalPages: Math.ceil(totalTasks / limitNumber),
            totalTasks
        });



    } catch (error) {
        res.status(500).json({
            message: "failed to fetch tasks",
            error: error.message
        })
    }
};

const createTask = async (req, res) => {
    try {
        const { title, description, status } = req.body;

        if (!title) {
            return res.status(400).json({
                message: "title is required"
            })
        }
        const task = await Task.create({
            title,
            description,
            status: status || 'pending',
            userId: req.user._id
        });

        res.status(201).json({
            message: "task created successfully",
            task
        })

    }catch(error) {
        res.status(500).json({
            message: "failed to create task",
            error: error.message
        })
    }
};

const updateTask = async (req,res)=>{
    try{
        const {title, description , status} =req.body;

        const task = await Task.findOne({
            _id: req.params.id,
            userId: req.user._id
        });

        if(!task) {
            return res.status(404).json({
                message: "task not found"
            })
        }

        task.title = title ?? task.title;
        task.description =  description ?? task.description;
        task.status = status ?? task.status;

        const updatedTask =await task.save();

        res.status(200).json({
            message: "task updated successfully",
            task: updatedTask
        });
    }catch (error){
        res.status(500).json({
            message: "failed to update task",
            error: error.message
        })
    }
}

const deleteTask = async ( req,res) =>{
    try{
        const task= await Task.findOneAndDelete({
            _id: req.params.id,
            userId: req.user._id
        });

        if(!task) {
            return res.status(404).json({
                message: "task not found"
            })
        }

        res.status(200).json({
            message: "task deleted successfully"
        })
    }catch(error) {
        res.status(500).json({
             message: "Failed to delete task",
      error: error.message

        })
    }
};

const toggleTaskStatus = async (req, res) =>{
    try{
        const task = await Task.findOne({
            _id: req.params.id,
            userId: req.user._id
        })

        if (!task) {
          return res.status(404).json({
            message: "Task not found"
         });
    }

    task.status = task.status === "pending" ? "completed" : "pending";

    const updatedTask = await task.save();
    res.status(200).json({
      message: "Task status updated",
      task: updatedTask
    });
    }catch(error) {
        res.status(500).json({
            message: "failed to toggle task satatus",
            error: error.message
        })
    }
}

module.exports = {
    getTasks,
    createTask,
    updateTask,
    deleteTask,
    toggleTaskStatus
}
