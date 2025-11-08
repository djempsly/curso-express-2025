const { createBlockTimeService, listReservationsService } = require('../services/adminService')

const createTimeBlock = async (req, res) =>{

    if (req.user.rol !== 'ADMIN') {
        return res.status(403).json({error: 'access denied'})
    } 

    
    const {startTime, endTime } = req.body;

    try {
        const newTimeBlock = await createBlockTimeService (startTime, endTime)
        res.status(201).json(newTimeBlock)
    } catch (error) {
        res.status(500).json({error: 'Error Creating Time Block'})}

}


const listReservation = async (req, res) =>{
     if (req.user.rol !== 'ADMIN') {
        return res.status(403).json({error: 'access denied'})
    } 

    try {
        const reservation = await listReservationsService()
        res.json(reservation)
    } catch (error) {
        res.status(500).json({error: 'Error fetching reservations'})
        
    }

}
 



module.exports = { createTimeBlock, listReservation }