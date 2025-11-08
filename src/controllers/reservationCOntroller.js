const { reservationsService } = require("../services/adminService")



exports.createReservation = async (req, res) =>{
    try {
        const reservation = await reservationsService.createReservation(req.body)
        res.status(201).json(reservation)
        
    } catch (error) {
        res.status(400).json({ error: error.message})
    }

}


exports.getReservation = async (req, res) =>{
    try {
        const reservation = await reservationsService.getReservation(req.params.id)
        if (!reservation) {
            return res.status(404).json({ error: 'Reservation not found'})
        }
        res.json(reservation)

    } catch (error) {
               res.status(400).json({ error: error.message})
    }
}

exports.updateReservation = async (req, res) =>{
    try {
        const reservation = await reservationsService.updateReservation( req.body, req.params.id)
        res.status(201).json(reservation)
        
    } catch (error) {
         res.status(400).json({ error: error.message})
    }
}


exports.deleteReservation = async (req, res) =>{
    try {
        const reservation = await reservationsService.deleteReservation(req.param.id)
        if (!reservation) {
            res.status(404).json({error: ' Reservation not found'})
        }
        res.status(204).json(reservation)
    } catch (error) {
         res.status(400).json({ error: error.message})
    }
}

