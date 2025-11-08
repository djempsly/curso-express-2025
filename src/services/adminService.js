const { PrismaClient } = require ('../../generated/prisma')
const prisma = new PrismaClient()

const createBlockTimeService = async (startTime, endTime) =>{

    try {
        const createTimeBlock = await prisma.timeBlock.create({
            data:{
                startTime: new Date(startTime),
                endTime: new Date(endTime)
            }
        })
        return createTimeBlock
    } catch (error) {
        throw new Error('Error al crear el time block')
    }
}

const listReservationsService  = async ()=> {
 
    const reservation = await prisma.appointment.findMany({
        include:{
            user: true,
            timeBlock: true
        }
    })
    return reservation
}


module.exports = { createBlockTimeService, listReservationsService }