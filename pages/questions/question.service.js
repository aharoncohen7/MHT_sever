
const { connect } = require("../../DL/connect")
const QuestionController = require("./question.controller")

const create = async (body) => {
    // await new Promise((resolve, reject) => { setTimeout(resolve, 1000 * 3) })
    try {
        if (!body.content) {
            return { success: false, message: "חסר מידע" };
        }
        if ((!body.contactMethod || (!body.email && !body.phone)) || (body.contactMethod == "email" && !body.email || body.contactMethod == ("sms" || "whatsapp") && !body.phone)) {
            return { success: false, message: "פרטי ההתקשרות לא נקלטו בהצלחה" };
        }
        const question = {
            subject: body.subject || undefined,
            content: body.content,
            contactDetails: {
                contactBy: body.contactMethod,
                email: body.email || undefined,
                phone: body.phone || undefined
            }
        }
        console.log("11111")
        await connect()
        console.log("222222")
        const newQuestion = await QuestionController.create(question);
        console.log("333333")

        if (newQuestion.id) {
            return { success: true, message: 'שאלתך נקלטה בהצלחה והיא תענה בתוך 48 שעות', question: newQuestion };
        }
        else{
            return { success: false, message: 'אירעה שגיאה - אנא נסה שוב מאוחר יותר' };
        }
    } catch (error) {
        console.log({ error })
        return { success: false, message: error.message };
    }
  
}
const get = async () => {
    // await new Promise((resolve, reject) => { setTimeout(resolve, 1000 * 3) })
    try {
        await connect()
        const allQuestion = await QuestionController.read({isActive: true});
        console.log("333333")

        if (allQuestion.length) {
            return { success: true, message: 'בקשתך נענתה, להלן רשימת השאלות', questions: allQuestion };
        }
        else{
            return { success: false, message: 'אירעה שגיאה - אנא נסה שוב מאוחר יותר' };
        }
    } catch (error) {
        console.log({ error })
        return { success: false, message: error.message };
    }
  
}


async function updateById(id, data) {
    console.log("in update Question", data);
    let updatedQuestion = await QuestionController.update(id, data)
    console.log("🚀 ~ updateById ~ updatedQuestion:", updatedQuestion)
    return updatedQuestion
  }

async function deleteById(id) {
    console.log("in delete Question", id);
    let updatedQuestion = await QuestionController.update(id, {isActive: false})
    console.log("🚀 ~ deleteById ~ updatedQuestion:", updatedQuestion)
    
    return updatedQuestion
  }


module.exports ={create, get, updateById, deleteById}