import { useState} from "react";
import CustomDropDown from "./CustomDropDown";

import Plus from "../assets/plus.svg";
import Close from "../assets/close.svg";

import "./styles/AddStation.css";

import axios from "axios"; 

const url="https://evoltsoftserver-production.up.railway.app/";

function AddStation({setStationId, stationId, edit, formData, setFormData, uniqueFilterOptions, setUniqueFilterOptions, setAllCards}){

    function handleFormChange(event){
        const {name, value}=event.target;
        setFormData((prev)=>{
            return {
                ...prev,
                [name]: value,
            }
        })
    }

    const [newField, setNewField]=useState("");
    const [error, setError]=useState("");
    const [open, setOpen]=useState("");
    const [message, setMessage]=useState("");

    async function handleSubmit(event){
        event.preventDefault();
        try{
            if(!edit){
                const response = await axios.post(`${url}/addstation`, {formData});
                setMessage(response.data.message);
                setTimeout(()=>{
                    setMessage("");
                }, 5000);
               
                setAllCards((prev)=>{
                    return ([...prev, formData]);
                })
            } else {
                const response = await axios.put(`${url}/editstation`, { formData, stationId });
                setMessage(response.data.message);
                setTimeout(()=>{
                    setMessage("");
                }, 5000);
                setStationId("");

                setAllCards((prev) =>
                    prev.map((card) =>
                        card._id === stationId
                        ? {
                            ...card,
                            name: formData.name,
                            latitude: formData.latitude,
                            longitude: formData.longitude,
                            status: formData.status,
                            powerOutput: formData.powerOutput,
                            connectorType: formData.connectorType
                            }
                        : card
                    )
                );


            }
            setFormData({
                name: "",
                latitude: "",
                longitude: "",
                status: "Active",
                powerOutput: "10",
                connectorType: "A",
            })
         
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.message || "An error occurred");
        }   
    }

    function handleAddNewOptions(feild){

        if (uniqueFilterOptions[feild].includes(newField)) {
            setError(`${newField} already present`);
            setTimeout(() => setError(""), 5000);
            return;
        }

        setOpen(false);
        setNewField("");
        setUniqueFilterOptions((prev)=>{
            return {
                ...prev,
                [feild]: [...prev[feild], newField],
            }
        })
    }

    function handleAddOptionClick(option){
        if(open===option){
            setOpen("");
            return;
        }
        setOpen(option);
    }

    return (
      <div className="addStation"> 
        {!edit && <h2>Add Station</h2>}
        {edit && 
        <div className="editAndClose">
            <h2>Edit Station</h2>
            <img src={Close} height="30" width="30" onClick={()=>setStationId("")} />
        </div>}
       
        <form className="addStationForm" onSubmit={handleSubmit}>
            <div className="formGroup">
                <label>Name of the station</label>
                <input
                    className="inputStyles"
                    type="text"
                    placeholder="Station Name"
                    name="name"
                    value={formData.name}
                    onChange={handleFormChange}
                    required
                />
            </div>

            <div className="formGroup">
                <label>Latitude</label>
                <input
                    className="inputStyles"
                    type="text"
                    placeholder="Latitude"
                    name="latitude"
                    value={formData.latitude}
                    onChange={handleFormChange}
                    required
                />
            </div>

            <div className="formGroup">
                <label>Longitude</label>
                <input
                    className="inputStyles"
                    type="text"
                    placeholder="Longitude"
                    name="longitude"
                    value={formData.longitude}
                    onChange={handleFormChange}
                    required
                />
            </div>

            <div className="formGroup">
                <label>Status</label>
                <CustomDropDown
                    name="status"
                    value={formData.status}
                    options={uniqueFilterOptions.statusOptions.filter(status => status !== "All")}
                    setSelectedOption={setFormData}
                />
            </div>

            <div className="formGroup">
                <label>Power Output (KW)</label>
                <div className="powerOutputAS">
                    <CustomDropDown
                        name="powerOutput"
                        value={formData.powerOutput}
                        options={uniqueFilterOptions.powerOutput.filter(status => status !== "All")}
                        setSelectedOption={setFormData}
                    />
                    <img src={Plus} height="30" width="30" onClick={() => handleAddOptionClick("powerOutput")} />
                </div>

                {error==="" && open === "powerOutput" && (
                    <div className="inputAndAddDiv">
                    <input
                        className="inputStyles"
                        value={newField}
                        placeholder="New Power Output"
                        onChange={(event) => setNewField(event.target.value)}
                        name="powerOutput"
                    />
                    <button type="button" className="buttonStyles" onClick={() => handleAddNewOptions("powerOutput")}>Add</button>
                    </div>
                )}
            </div>

            <div className="formGroup">
                <label>Connector Type</label>
                <div className="connectorTypeAS">
                    <CustomDropDown
                        name="connectorType"
                        value={formData.connectorType}
                        options={uniqueFilterOptions.connectorType.filter(status => status !== "All")}
                        setSelectedOption={setFormData}
                    />
                    <img src={Plus} height="30" width="30" onClick={() => handleAddOptionClick("connectorType")} />
                </div>

                {error==="" && open === "connectorType" && (
                    <div className="inputAndAddDiv">
                    <input
                        className="inputStyles"
                        value={newField}
                        placeholder="New Connector Type"
                        onChange={(event) => setNewField(event.target.value)}
                        name="connectorType"
                    />
                    <button type="button" className="buttonStyles" onClick={() => handleAddNewOptions("connectorType")}>Add</button>
                    </div>
                )}
            </div>

            {!edit && <button className="buttonStyles" type="submit">Add</button>}
            {edit && <button className="buttonStyles" type="submit">Edit</button>}

            {error && <p style={{color: "red"}}>{error}</p>}
            {message && <p style={{color: "green"}}>{message}</p>}

        </form>
      </div>
    );
}

export default AddStation;