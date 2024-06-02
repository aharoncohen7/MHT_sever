const express = require("express");
const todosRoute = express.Router();
const db = require("../db/todos");
const IAM = require('../../../middlewares/monitoring');

// All user todos
todosRoute.get("/:userId",IAM.validationParams,  async (req, res) => {
    try {
        if (parseInt(req.user.id) === parseInt(req.params.userId)) {
            const todos = await db.getTodosByUserId(parseInt(req.params.userId));
            if (todos.length) {
                
                res.status(200).json(todos);
                return;
            }
            res.status(404).send("Not Found");
        }
        res.status(400).send("You do not have permission for this user");
    } catch (error) {
        res.status(500).send(error);
    }
})

// Get a certain todo
todosRoute.get("/s/:todoId",IAM.validationParams,  async (req, res) => {
    try {
        const todo = await db.getCertainTodo(req.params.todoId);
        if (todo) {
            if (parseInt(req.user.id) === parseInt(todo.userId)) {
                res.status(200).json(todo);
                return;
            }
            res.status(400).send();
        }
        res.status(404).send();
    } catch (error) {
        res.status(500).send(error);
    }
});

// Search by title
todosRoute.get("/searchTodos/:userId/:str",IAM.validationParams,  async (req, res) => {
    try {
        if (parseInt(req.user.id) === parseInt(req.params.userId)) {
            const todos = await db.searchTodo(req.params.userId, req.params.str);
            if (todos.length) {
                res.status(200).json(todos);
                return;
            }
            res.status(404).send();
            return;
        }
        res.status(400).send();

    } catch (error) {
        res.status(500).send(error);
    }
});

// Search by ID
todosRoute.get("/searchById/:userId/:str",IAM.validationParams,  async (req, res) => {
    try {
        if (parseInt(req.user.id) === parseInt(req.params.userId)) {
            const todos = await db.searchById(req.params.userId, req.params.str);
            if (todos.length) {
                res.status(200).json(todos);
                return;
            }
            res.status(404).send();
            return
        }
        res.status(400).send();

    } catch (error) {
        res.status(500).send(error);
    }
});


// Search by performance
todosRoute.get("/searchByCompleted/:userId/:state",IAM.validationState,  async (req, res) => {
    try {
        if (parseInt(req.user.id) === parseInt(req.params.userId)) {
            const todos = await db.searchByCompleted(req.params.userId, req.params.state);
            if (todos.length) {
                res.status(200).json(todos);
                return;
            }
            res.status(404).send();
            return
        }
        res.status(400).send();

    } catch (error) {
        res.status(500).send(error);
    }
});


// creation
todosRoute.post("/", IAM.handleNewTodo, async (req, res) => {
    try {
        if (req.body.userId !== req.user.id) {
            res.status(400).send();
            return
        }
        const newTodo = await db.addTodo(req.body.userId, req.body.title);
        if (newTodo) {
            res.status(201).json(newTodo);
            return;
        }
        res.status(400).send();
    } catch (error) {
        res.status(500).send(error);
    }
});


// Editing
todosRoute.patch("/:todoId",IAM.validationParams, IAM.handleEditTodo,  async (req, res) => {
    try {
        const oldTodo = await db.getCertainTodo(req.params.todoId);
        if (oldTodo && req.user.id === oldTodo.userId) {
            const editedTodo = await db.editTodo(req.params.todoId, req.body.title);
            if (editedTodo) {
                res.status(200).json(editedTodo);
                return;
            }
        }
        res.status(400).send();
    } catch (error) {
        res.status(500).send();
    }
}
);


// Toggle execution mode
todosRoute.patch("/updateCompleted/:todoId",IAM.validationParams,  async (req, res) => {
        try {
            const oldTodo = await db.getCertainTodo(req.params.todoId);
        if (oldTodo && req.user.id === oldTodo.userId) {
            const todo = await db.updateCompleted(req.params.todoId);
            if (todo) {
                res.status(200).json(todo);
                return;
            }
        }
            res.status(404).send();
        } catch (error) {
            res.status(500).send(error);
        }
    }
);


// Delete
todosRoute.delete("/:todoId",IAM.validationParams, async (req, res) => {
    try {
        const todo = await db.getCertainTodo(req.params.todoId);
        if (todo && req.user.id === todo.userId) {
        const deletedTodo = await db.deleteTodo(req.params.todoId);
        if (deletedTodo) {
            res.status(200).json(deletedTodo);
            return;
        }
        res.status(404).send();
        return;
    }
        res.status(400).send();
    } catch (error) {
        res.status(500).send(error);
    }
});


module.exports = todosRoute;















// function handleWrongId(req, res, next) {
//     const idSchema = {
//         todoId: Joi.number().min(1),
//         userId: Joi.number().min(1)
//     }
//     const { error } = idSchema.validate(req.params.id);
//     if (error) {
//         res.status(400).send(error.details[0].message);
//         return;
//     }
//     next();
// }




// function handleBodyValidation(req, res, next) {
//     const userSchema = Joi.object({
//         name: Joi.string().min(2),
//         age: Joi.number().min(1),
//     });
//     const { error } = userSchema.validate(req.body);
//     if (error) {
//         res.status(400).send(error.details[0].message);
//         return;
//     }
//     next();
// }




// const getUsers2 = async () => {
//   const response = await axios.get("/api/users");
//   console.log(response.data);
//   return response.data;
// };



// // אימות
// async function authenticate(req, res, next) {
//     try {
//         const auth = req.headers.auth;
//         if (!auth) {
//             res.status(400).send()
//             return;
//         }
//         const [username, password] = auth.split(':');
//         const check = await checkUser(username, password);
//         if (!check) {
//             res.status(400).send()
//             return;
//         }
//         const user = await getUser(check)
//         req.user = user;
//         next();
//     } catch (err) {
//         console.log(err);
//         res.status(500).send();
//     }
// }

// וולידציה פראמס
// function validationParams(req, res, next) {
//     const schema = Joi.number().min(1).required();
//     const { error } = schema.validate(req.params.todoId||req.params.userId);
//     if (error) {
//         res.status(400).send(error.details[0].message);
//         return
//     }
//     next();
// };

// וולידציה מצב ביצוע
// function validationState(req, res, next) {
//     const schema = Joi.number().min(0).max(1);
//     const { error } = schema.validate(req.params.state);
//     if (error) {
//         res.status(400).send(error.details[0].message);
//         return
//     }
//     next();
// };

// וולידציה הוספת חדש
// function handleNewTodo(req, res, next) {
//     const schema = Joi.object({
//         title: Joi.string().required(),
//         userId: Joi.number().min(1).max(10).required()
//     })
//     const { error } = schema.validate( req.body );
//     if (error) {
//         res.status(400).send(error.details[0].message);
//         return;
//     }
//     next();
// }

// // וולידציה עריכה
// function handleEditTodo(req, res, next) {
//     const schema = Joi.object({
//         title: Joi.string().required(),
//     })
//     const { error } = schema.validate( req.body );
//     if (error) {
//         res.status(400).send(error.details[0].message);
//         return;
//     }
//     next();
// }
