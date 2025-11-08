const { PrismaClient } = require ('../../generated/prisma')
const prisma = new PrismaClient()


exports.createReservation = async (data) =>{
    const conflict = await prisma.appointment.findFirst({
        where: {
            date: data.date,
            timeBlockId: data.timeBlockId
              
        }
    })
    if (conflict) {
        throw new Error('Reservation not available')
    }

    return prisma.appointment.create({data})
}

exports.getReservation = (id) =>{
   return prisma.appointment.findUnique({
        where:{
            id: parseInt(id, 10)
        }
    })
}

exports.updateReservation =  async (data, id) =>{
    const conflict = await prisma.appointment.findFirst({
        where: {
            date: data.date,
            timeBlockId: data.timeBlockId,
            id: { not: parseInt(id, 10)}
        }

    })

    if (conflict) {
        throw new Error('Appointment is ocuppied or unavailable')
        
    }

    return prisma.appointment.update({
        where: { id: parseInt(id, 10)},
        data
    })
}


exports.deleteReservation = (id) =>{
    return prisma.appointment.delete({
        where: { id: parseInt(id, 10) }
    })
}


