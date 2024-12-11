import React, { useEffect, useState } from 'react';
import styled from '@emotion/styled';
import { Container, TextField, Button, Typography, Box, Checkbox, FormControlLabel, Select, MenuItem, Alert, Snackbar } from '@mui/material';
import axios from 'axios';
import { Appointment, ServiceType } from '../models/Appointment';

const BookingContainer = styled(Container)`
  text-align: center;
  margin-top: 1rem;
  background-image: url('../assets/barbershop-background.jpg');
  background-size: cover;
  background-position: center;
  height: 100vh;
`;

const BookingForm = styled(Box)`
  background-color: rgba(255, 255, 255, 0.8);
  padding: 2rem;
  border-radius: 10px;
  display: inline-block;
  max-width: 500px;
  width: 100%;
  margin: 0 auto;
`;

const BookingButton = styled(Button)`
  background-color: #333;
  color: #fff;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  display: inline-block;
  margin-top: 1rem;

  &:hover {
    background-color: #555;
  }
`;




const Booking: React.FC = () => {
  const [date, setDate] = useState('');
  const [time, setTime] = useState('modern');
  const [service, setService] = useState<ServiceType>("HAIRCUT");
  const [style, setStyle] = useState<string>("modern");
  const [confirmationS, setConfirmationS] = useState(false);
  const [confirmationF, setConfirmationF] = useState(false);
  const [severity, setSeverity] = useState<any>("success");
  const [clientName, setClientName] = useState<string>("");
  const [isReservedC, setIsReservedC] = useState<boolean>(false);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isHaircutChecked, setHaircutChecked] = useState<boolean>(false); 
  const [isBeardChecked, setBeardChecked] = useState<boolean>(false);
  const [timeReserved, setTimeReserved] = useState<number>(25);
  const [shouldDisable, setShouldDisable] = useState<boolean>(false);

  useEffect(() => {
    if (date) {
      axios
        .get<Appointment[]>(`http://13.38.216.111/api/appointments/${date}`)
        .then((response) => {
          setAppointments(response.data);
          setIsReservedC(isReserved(`${date}T${time}`,response.data))
        })
        .catch((error) =>
          console.error("Erreur lors du chargement des réservations : ", error)
        );
    }
  }, [date, time]);

  useEffect(()=>{
    setService(isHaircutChecked && isBeardChecked ? "HAIRCUT_AND_BEARD" : (isHaircutChecked ? "HAIRCUT" : "BEARD"));
    setTimeReserved(isHaircutChecked && isBeardChecked ?  40 : (isHaircutChecked ? 25 : 15));
    setShouldDisable(!isHaircutChecked);
  },[isHaircutChecked, isBeardChecked])


  const handleServiceChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = event.target;
    if (value === "Haircut") setHaircutChecked(checked); 
    if (value === "Beard") setBeardChecked(checked); 
  };
  const isReserved = (dateDebutChoisit:string, myAppointments:Appointment[]):boolean =>{
    let reserved:boolean = false;
    myAppointments.forEach((appointment) => {
    const start = new Date(appointment.startTime).getTime(); // timestamp
    const end = new Date(appointment.endTime).getTime();
    const debutChoisit = new Date(dateDebutChoisit).getTime();
    
    // ajout de 25 minutes(ici je suppose que la duree pour que le client fini l'operation du coupe cheuveux dure 25 minutes)
    // ajout de 15 minutes(ici je suppose que la duree pour que le client fini l'operation du coupe barbre dure 15 minutes)
    // ajout de 40 minutes pour les deux(coupe cheuveux et barbre)
    const dateFin = debutChoisit + timeReserved * 60000;
    if (
      // ces vérifications pour assurer que il y'a pas un chevauchement entres les rendez-vous(ici j'ai supposé qu'il yas un seul coiffeur (:))
      (start <= debutChoisit && debutChoisit < end) || 
      (start < dateFin && dateFin <= end) ||
      (debutChoisit <= start && dateFin >= end) 
    ) {
      reserved = true;
    }
    });
    return reserved;
  }

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const startTime = `${date}T${time}`;
    const startDateTime = new Date(startTime);
      
    const endDateTime = new Date(startDateTime.getTime() + timeReserved * 60000); 
    const endTime = `${date}T${endDateTime.getHours().toString().padStart(2, "0")}:${endDateTime.getMinutes().toString().padStart(2, "0")}:00`;
    const appointment:Appointment = {
      clientName,
      startTime: `${date}T${time}`,
      endTime: endTime,
      service : service,
      style : style,
    };

    axios
    .post("http://13.38.216.111/api/appointments",appointment)
    .then(()=>{
      const newAppointments = [...appointments, appointment];
      setAppointments((prevAppointments) => [...prevAppointments, appointment]);
      setIsReservedC(isReserved(`${date}T${time}`, newAppointments));
      setSeverity("success");
      setConfirmationS(true);
      setConfirmationF(false);
    })
    .catch((error) =>{
      console.error("Erreur lors de la réservation : ", error);
      setSeverity("error");
      setConfirmationS(false);
      setConfirmationF(true);
    }
    );    
  };

  const handleClose = (_event?: React.SyntheticEvent | Event, reason?: string) => { if (reason === 'clickaway') { return; } setConfirmationS(false); setConfirmationF(false);};


  return (
    <BookingContainer>
      <Typography variant="h4" gutterBottom>Book your appointment below</Typography>
      <BookingForm>
        <form onSubmit={handleSubmit}>
          <TextField label="Client Name" fullWidth margin="normal" value={clientName} onChange={(e) => setClientName(e.target.value)} />
          <TextField label="Date" type="date" fullWidth margin="normal" InputLabelProps={{ shrink: true }} value={date} onChange={(e) => setDate(e.target.value)} />
          <TextField label="Time" type="time" fullWidth margin="normal" InputLabelProps={{ shrink: true }} value={time} onChange={(e) => setTime(e.target.value)}/>
          <Box sx={{ display: 'flex', justifyContent: 'space-around', mt: 2 }}>
            <FormControlLabel control={<Checkbox value="Haircut" onChange={handleServiceChange} />} label="Haircut" />
            <FormControlLabel control={<Checkbox value="Beard" onChange={handleServiceChange} />} label="Beard" />
          </Box>
          <Select fullWidth value={style} onChange={(e) => setStyle(e.target.value as string)} disabled={shouldDisable} displayEmpty>
            <MenuItem value="" disabled>Select Style</MenuItem>
            <MenuItem value="classic">Classic</MenuItem>
            <MenuItem value="modern">Modern</MenuItem>
            <MenuItem value="fade">Fade</MenuItem>
            <MenuItem value="buzz">Buzz Cut</MenuItem>
          </Select>
          <BookingButton type="submit" variant="contained" fullWidth sx={{ mt: 2 }} disabled={isReservedC}>Book Now</BookingButton>
        </form>
        
      <Snackbar open={confirmationS || confirmationF} onClose={handleClose} autoHideDuration={6000} anchorOrigin={{ vertical:"bottom", horizontal:"center" }}>
        <Alert
          onClose={handleClose}
          severity={severity}
          variant="filled"
          sx={{ width: '100%' }}
        >
          { confirmationS ? "Your appointment has been booked!!" : "Erreur lors de la réservation :"}
        </Alert>
      </Snackbar>
      </BookingForm>
    </BookingContainer>
  );
};

export default Booking;
