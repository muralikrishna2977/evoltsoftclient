import "./styles/Card.css";

function Card({name, latitude, longitude, status, powerOutput, connectorType}){
    return (
        <div className="cardProperties">
            <p>{`Name: ${name}`}</p>
            <p>{`Latitude: ${latitude}`}</p>
            <p>{`Longitude: ${longitude}`}</p>
            <p>{`Status: ${status}`}</p>
            <p>{`Power Output: ${powerOutput}`}</p>
            <p>{`Connecter Type: ${connectorType}`}</p>
        </div>
    );
}

export default Card;