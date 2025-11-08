const { PrismaClient } = require ('../../generated/prisma')
const prisma = new PrismaClient()

exports.getUserAppointments = async(userId)=>{
    try {
        const appointments = await prisma.appointment.findMany({
            where: {userId: parseInt(userId)}
        })
        return appointments
    } catch (error) {
        throw new Error('Error al obtener el historial de citas')
    }
}





