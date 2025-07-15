import RoomMateCard from "../../components/roommatecard";
import Navbar from "../../components/Navbar";
import '../../styles/Roommates.css'

function SuggestedRoommates() {
    const Roommates = [
    {
        id: 1,
        name: 'Alice Uwimana',
        nationality: 'Rwandan',
        gender: 'Female',
        looking: 'Kimironko',
        budget: '$300/month',
        image: 'https://randomuser.me/api/portraits/women/1.jpg'
    },
    {
        id: 2,
        name: 'Brian Mugisha',
        nationality: 'Ugandan',
        gender: 'Male',
        looking: 'Remera',
        budget: '$250/month',
        image: 'https://randomuser.me/api/portraits/men/2.jpg'
    },
    {
        id: 3,
        name: 'Cynthia Niyonsaba',
        nationality: 'Burundian',
        gender: 'Female',
        looking: 'Gikondo',
        budget: '$350/month',
        image: 'https://randomuser.me/api/portraits/women/3.jpg'
    }
    ];

    return (
        <> 
            <Navbar/>
            <div className="suggested-roommates">
                <h2>Roommates for you</h2>
                <div className="all-roommates">
                    {Roommates.map((Roommate,index) => <RoomMateCard key={index} roommate={Roommate}/>)}
                </div>
            </div>
        </>
    );
}

export default SuggestedRoommates;