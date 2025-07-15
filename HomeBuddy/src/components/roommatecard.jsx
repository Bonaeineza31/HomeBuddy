import './roommatecard.css'
function RoomMateCard({roommate}) {
    return(
        <div className="profilecard">
            <img src={roommate.image} alt="" />
            <div className="roommate-description">
                <p className="name">{roommate.name}</p>
                <p className="rm-gender">{roommate.gender}</p>
                <p className="nationality">{roommate.nationality}</p>
                <p className="looking"><span>Looking in: </span>{roommate.looking}</p>
                <p className="budget"><span>Budget: </span>{roommate.budget}</p>
            </div>
            <button className="text-roommate">Reach out</button>
        </div>
    )
}

export default RoomMateCard;