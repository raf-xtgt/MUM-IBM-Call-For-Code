import {useState} from "react"

export default () => {

    // this is what we have from the ibm ML
    const [preds] = useState({
        data:[80.18950975, 81.18950975, 80.18950975e+00, 82.18950975e+00, 81.18950975e+00, 81.18950975e+00, 82.18950975e+00,
            82.18950975e+00, 82.18950975e+00, 83.18950975e+00, 80.18950975e+00, 82.18950975e+00, 82.18950975e+00,
            84.18950975e+00, 85.18950975e+00, 87.18950975e+00, 88.95115566, 2.03315811e+01,
             5.39486084e+01, 1.24201225e+02, 3.10406433e+02, 4.43264740e+02, 4.95865540e+02, 5.02505646e+02,
             5.21787781e+02, 4.45637451e+02, 6.23931091e+02, 6.66684570e+02, 7.95230774e+02,
             7.80720520e+02, 8.04948242e+02, 7.60540955e+02, 4.18305176e+02, 2.61301178e+02, 3.10406433e+02,
             1.85363861e+02, 4.92062302e+01, 3.59111824e+01, 5.01422272e+01, 1.21585054e+01,
            1.19267625e+01, 80.18950975e+00, 80.18950975e+00, 80.18950975e+00, 80.18950975e+00,
            80.18950975e+00, 80.18950796e+00, 80.18950796e+00],
        
            timeStamps : ["12:00AM", "12:30AM", "01:00AM","01:30AM","02:00AM","02:30AM", "03:00AM", "03:30AM",
            "04:00AM", "04:30AM", "05:00AM", "05:30AM", "06:00AM", "06:30AM","07:00AM", "07:30AM",
            "08:00AM", "08:30AM", "09:00AM", "09:30AM", "10:00AM", "10:30AM", "11:00AM", "11:30AM", 
            "12:00PM","12:30PM", "01:00PM","01:30PM","02:00PM","02:30PM", "03:00PM", "03:30PM",
            "04:00PM", "04:30PM", "05:00PM", "05:30PM", "06:00PM", "06:30PM","07:00PM", "07:30PM",
            "08:00PM", "08:30PM", "09:00PM", "09:30PM", "10:00PM", "10:30PM", "11:00PM", "11:30PM",]
            
    })

    // init state variables
    const [results, setResults] = useState({
        data:[],
        loading:false,
        error:null
    })

    // making api requests
    const getEnergyPredictions = async (type) => {

        // set the data to the predictions
        let output = []

        const predictions = preds.data
        const timeStamps = preds.timeStamps
        for (let i=0; i<predictions.length; i++){
            const data={
                value: predictions[i],
                label: timeStamps[i],
            }
            output.push(data)
        }

        setResults({
            data:output,
            loading:false,
            error:null,
        })
    

    };

    // return from the whole exported function
    //console.log("Prediction results", results)
    return [results, getEnergyPredictions]
}
