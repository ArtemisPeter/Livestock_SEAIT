import { IonBadge, IonButton, IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonContent, IonIcon, IonInput, IonItem, IonItemOption, IonItemOptions, IonItemSliding, IonLabel, IonModal, IonRow, IonSelect, IonSelectOption, useIonAlert } from "@ionic/react";
import React, { useEffect, useRef, useState } from "react";
import { SQLiteDBConnection } from "@capacitor-community/sqlite";
import useSQLiteDB from "../composables/useSQLiteDB";
import { alertOutline, checkmark, closeOutline, createOutline } from "ionicons/icons";

type animalID = {
    animal_id: number;
}

type EsterusHead = {
    id: number, 
    animal_id: number,
    dateCreated: string,
    status:string
}

type Breeder = {
    id: number, 
    fname: string,
    lname: string
}

type Animal = {
    id: number, 
    name: string
}

type AnimalType = {
    animal_Type: number
}

type EstrusDetails = {
    id: number, 
    Breeder_Date: string, 
    animal_id_male: number,
    type: string,
    status: string, 
    breeder_id: number, 
    remarks: string, 
    breeder_fname: string,
    breeder_lname: string,
    animal_name: string,
    eh_id:number
}

const Estrus: React.FC<animalID> = ({ animal_id }) => {
    const [EsterusHead, setEsterusHead] = useState<Array<EsterusHead>>();
    const {performSQLAction, initialized} = useSQLiteDB();
    const [presentAlert] = useIonAlert();
    const [EH_id, setEH_id] = useState(0);
    const [BreederData, setBreederData] = useState<Array<Breeder>>();
    const [breeder, setBreeder] = useState(0);
    const [animalType, setAnimalType] = useState(0);
    const [animal, setAnimal] = useState<Array<Animal>>();
    const [selectedAnimal, setSelectedAnimal] = useState(0);
    const [selectedType, setSelectedType] = useState("");
    const [remarks, setRemarks] = useState("");
    const [Estrus_Details, setEstrus_Details] = useState<Array<EstrusDetails>>();
    const [selectedAnimal_id, setSelectedAnimal_id] = useState(0);
    const [selectedBreedType, setSelectedBreedType] = useState("");
    const [selectedBreeder, setSelectedBreeder] = useState(0);
    const [selectedRemarks, setSelectedRemarks] = useState("");

    useEffect(()=>{
        loadEsterusHead(animal_id);
        loadBreeder();
        loadAnimalData(animal_id);
        
    }, [initialized])
    
    const loadEsterusHead = (animal_id:number) => {
        try{
            performSQLAction(async(db:SQLiteDBConnection | undefined)=>{
             const data = await db?.query(`SELECT * FROM Estrus_Head WHERE animal_id = ?`, [animal_id]);
             setEsterusHead(data?.values);
            })
         }catch(error){
             console.log((error as Error).message);
            
         }
    }

    const loadEstusDetails = (EH_id: number) => {
        try{
            performSQLAction(async(db:SQLiteDBConnection | undefined)=>{
             const data = await db?.query(`
                SELECT ED.id, 
                ED.Breeder_Date, ED.animal_id_male,
                ED.type, ED.status, ED.breeder_id, ED.remarks,
                P.fname AS breeder_fname, P.lname as breeder_lname,
                A.name as animal_name, EH.id AS eh_id
                FROM Estrus_Details AS ED
                INNER JOIN Estrus_Head AS EH ON EH.id = ED.Estrus_Head
                INNER JOIN Person AS P ON P.id = ED.breeder_id
                INNER JOIN Animal AS A ON A.id = ED.animal_id_male
                WHERE EH.id = ? AND ED.archive = 0`, 
                [EH_id]);
                console.log(EH_id)
                
                setEstrus_Details(data?.values)
                console.log(data);
            })
         }catch(error){
             console.log((error as Error).message);
            
         }
    }

    const InsertEsterusHead = (animal_id:number) => {
        try{
            performSQLAction(async(db:SQLiteDBConnection | undefined)=>{
             const data = await db?.query(`INSERT INTO Estrus_Head (animal_id, dateCreated, archive, status)
                    VALUES (?, date('now'), 0, 'On Going')
                `, [animal_id]);
                if(data){
                    presentAlert({
                        header: "Success",
                        buttons: ['OK']
                    })
                    const data = await db?.query(`SELECT * FROM Estrus_Head WHERE animal_id = ? AND archive = 0`, [animal_id]);
                    setEsterusHead(data?.values);
                }else{
                    presentAlert({
                        header: "Error",
                        buttons: ['OK']
                    })
                }
            })
         }catch(error){
             console.log((error as Error).message);
            
         }
    }

   const loadBreeder = () =>{
    try{
        performSQLAction(async(db:SQLiteDBConnection | undefined)=>{
         const data = await db?.query(`SELECT id, fname, lname FROM Person WHERE role_id = 2`);
         setBreederData(data?.values);
         console.log(data)
        })
     }catch(error){
         console.log((error as Error).message);
        
     }
   }
   const loadAnimalData = (animal_id: number) => {
    try {
        performSQLAction(async (db: SQLiteDBConnection | undefined) => {
            // First query: get the Animal_Type_id based on the provided animal_id
            const animalTypeData = await db?.query(`
                SELECT AT.id AS animal_Type 
                FROM Animal AS A
                INNER JOIN Breed AS B ON B.id = A.breed_id
                INNER JOIN Animal_Type AS AT ON AT.id = B.Animal_Type_id
                WHERE A.id = ?
            `, [animal_id]);
            
            const Animal_Type_id = animalTypeData?.values[0]?.animal_Type;
            console.log(animal_id)
            console.log(Animal_Type_id);
            
            if (Animal_Type_id === undefined) {
                console.error("Animal_Type_id not found for the given animal_id");
                //return;
            }else{
                console.log("SUCCESS FOUND")
            }

            // Set the retrieved Animal_Type_id
            setAnimalType(Animal_Type_id);

            // Second query: load all animals of that type
            const animalData = await db?.query(`
                SELECT A.id, A.name 
                FROM Animal AS A
                INNER JOIN Breed AS B ON B.id = A.breed_id
                INNER JOIN Animal_Type AS AT ON AT.id = B.Animal_Type_id
                WHERE AT.id = ? AND A.gender = 'Male'
            `, [Animal_Type_id]);
            
            // Set the animals of the retrieved type
            setAnimal(animalData?.values);
            console.log(animalData);
        });
    } catch (error) {
        console.log((error as Error).message);
    }
};

const InsertEstrusDetails = (EH_id:number, selectedAnimal:number, selectedType:string, remarks:string, breeder:number) =>{
    try{
        performSQLAction(async(db:SQLiteDBConnection | undefined)=>{
            const data = await db?.query(`
                INSERT INTO Estrus_Details (Estrus_Head, Breeder_Date, animal_id_male, type, status, breeder_id, remarks, archive)
                VALUES (?, date('now'), ?, ?, 'On Going', ?, ?, 0) 
            `, [EH_id, selectedAnimal, selectedType, breeder, remarks]);
            
            if(data){
                presentAlert({
                    header: "Success",
                    buttons: ['OK']
                })
                const data = await db?.query(`
                    SELECT ED.id, 
                    ED.Breeder_Date, ED.animal_id_male,
                    ED.type, ED.status, ED.breeder_id, ED.remarks,
                    P.fname AS breeder_fname, P.lname as breeder_lname,
                    A.name as animal_name
                    FROM Estrus_Details AS ED
                    INNER JOIN Estrus_Head AS EH ON EH.id = ED.Estrus_Head
                    INNER JOIN Person AS P ON P.id = ED.breeder_id
                    INNER JOIN Animal AS A ON A.id = ED.animal_id_male
                    WHERE EH.id = ? AND ED.archive = 0`, 
                    [EH_id]);
                    console.log(EH_id)
                    setEstrus_Details(data?.values)
            }else{
                presentAlert({
                    header: "Error",
                    buttons: ['OK']
                })
            }
        })
     }catch(error){
         console.log((error as Error).message);
        
     }
}

    const UpdateEstrusDetails = (animal_id_male:number, type:string, breeder_id:number, remarks:string, ED_id:number) =>{
        try{
            performSQLAction(async(db:SQLiteDBConnection | undefined)=>{
                const data = await db?.query(`
                   UPDATE Estrus_Details SET animal_id_male = ?, type =?, breeder_id = ?, remarks = ?
                   WHERE id = ?
                `, [animal_id_male, type, breeder_id, remarks, ED_id]);
                
                if(data){
                    presentAlert({
                        header: "Success",
                        buttons: ['OK']
                    })
                    const data = await db?.query(`
                        SELECT ED.id, 
                        ED.Breeder_Date, ED.animal_id_male,
                        ED.type, ED.status, ED.breeder_id, ED.remarks,
                        P.fname AS breeder_fname, P.lname as breeder_lname,
                        A.name as animal_name
                        FROM Estrus_Details AS ED
                        INNER JOIN Estrus_Head AS EH ON EH.id = ED.Estrus_Head
                        INNER JOIN Person AS P ON P.id = ED.breeder_id
                        INNER JOIN Animal AS A ON A.id = ED.animal_id_male
                        WHERE EH.id = ? AAND ED.archive = 0`, 
                        [EH_id]);
                        console.log(EH_id)
                        setEstrus_Details(data?.values)
                }else{
                    presentAlert({
                        header: "Error",
                        buttons: ['OK']
                    })
                }
            })
         }catch(error){
             console.log((error as Error).message);
            
         }
    }

    const setPregnant = async (ED_id: number, eh_id: number) => {
        console.log(ED_id)
        console.log(eh_id);
        try {
            await performSQLAction(async (db: SQLiteDBConnection | undefined) => {
                // Update Estrus_Head to "Pregnant"
                const data2 = await db?.query(`
                    UPDATE Estrus_Head SET status = 'Pregnant' WHERE id = ?
                `, [eh_id]);
    
                // Update Estrus_Details to "Failed" for the related Estrus_Head
                await db?.query(`
                    UPDATE Estrus_Details SET status = 'Failed' WHERE Estrus_Head = ?
                `, [eh_id]);
    
                // Set specific Estrus_Details to "Pregnant"
                await db?.query(`
                    UPDATE Estrus_Details SET status = 'Pregnant' WHERE id = ?
                `, [ED_id]);

                  // Set specific Estrus_Details to "Pregnant"
                await db?.query(`
                    UPDATE Animal SET pregnancy_status = 1 WHERE id = ?
                `, [animal_id]);
    
                // Fetch updated Estrus_Details records
                const data7 = await db?.query(`
                    SELECT ED.id, ED.Breeder_Date, ED.animal_id_male, ED.type, 
                        ED.status, ED.breeder_id, ED.remarks, P.fname AS breeder_fname, 
                        P.lname AS breeder_lname, A.name AS animal_name
                    FROM Estrus_Details AS ED
                    INNER JOIN Estrus_Head AS EH ON EH.id = ED.Estrus_Head
                    INNER JOIN Person AS P ON P.id = ED.breeder_id
                    INNER JOIN Animal AS A ON A.id = ED.animal_id_male
                    WHERE EH.id = ? AND ED.archive = 0
                `, [eh_id]);
                
                console.log("Estrus_Head ID:", eh_id);
                setEstrus_Details(data7?.values);
    
                if (data2) {
                    presentAlert({
                        header: "Success",
                        buttons: ["OK"]
                    });
    
                    // Insert into Pregnancy table if Estrus_Details is set to "Pregnant"
                    const insertPregnant = await db?.query(`
                        INSERT OR IGNORE INTO Pregnancy (
                            estrus_details_id, dateConfirmed, ExpDueDate, ActualDueDate, 
                            status, dateFailed, archive
                        ) VALUES (?, DATE('now'), '', '', 'On Going', '', 0)
                    `, [ED_id]);
    
                    
    
                    // Fetch updated Estrus_Head records
                    const data5 = await db?.query(`
                        SELECT * FROM Estrus_Head WHERE id = ?
                    `, [eh_id]);
                    setEsterusHead(data5?.values);
    
                    // Re-fetch updated Estrus_Details records
                    const dataS = await db?.query(`
                        SELECT ED.id, ED.Breeder_Date, ED.animal_id_male, ED.type, 
                            ED.status, ED.breeder_id, ED.remarks, P.fname AS breeder_fname, 
                            P.lname AS breeder_lname, A.name AS animal_name
                        FROM Estrus_Details AS ED
                        INNER JOIN Estrus_Head AS EH ON EH.id = ED.Estrus_Head
                        INNER JOIN Person AS P ON P.id = ED.breeder_id
                        INNER JOIN Animal AS A ON A.id = ED.animal_id_male
                        WHERE EH.id = ? AND ED.archive = 0
                    `, [eh_id]);
                    
                    console.log("Estrus_Head ID:", eh_id);
                    setEstrus_Details(dataS?.values);

                    const datas = await db?.query(`SELECT * FROM Estrus_Head WHERE animal_id = ?`, [animal_id]);
             setEsterusHead(datas?.values);
            

                    
                } else {
                    presentAlert({
                        header: "Error",
                        buttons: ["OK"]
                    });
                }
            });
        } catch (error) {
            console.error("Error in setPregnant function:", (error as Error).message);
        }
    };
    

    const setFailed = (ED_id:number) =>{
        try{
            performSQLAction(async(db:SQLiteDBConnection | undefined)=>{
                const data = await db?.query(`
                   UPDATE Estrus_Details SET status = 'Failed'
                   WHERE id = ?
                `, [ED_id]);
                
                if(data){
                    presentAlert({
                        header: "Success",
                        buttons: ['OK']
                    })
                    const data = await db?.query(`
                        SELECT ED.id, 
                        ED.Breeder_Date, ED.animal_id_male,
                        ED.type, ED.status, ED.breeder_id, ED.remarks,
                        P.fname AS breeder_fname, P.lname as breeder_lname,
                        A.name as animal_name
                        FROM Estrus_Details AS ED
                        INNER JOIN Estrus_Head AS EH ON EH.id = ED.Estrus_Head
                        INNER JOIN Person AS P ON P.id = ED.breeder_id
                        INNER JOIN Animal AS A ON A.id = ED.animal_id_male
                        WHERE EH.id = ? AND ED.archive = 0`, 
                        [EH_id]);
                        console.log(EH_id)
                        setEstrus_Details(data?.values)
                }else{
                    presentAlert({
                        header: "Error",
                        buttons: ['OK']
                    })
                }
            })
         }catch(error){
             console.log((error as Error).message);
            
         }
    }

    const archiveED = (ED_id:number) =>{
        try{
            performSQLAction(async(db:SQLiteDBConnection | undefined)=>{
                const data = await db?.query(`
                   UPDATE Estrus_Details SET archive = 1
                   WHERE id = ?
                `, [ED_id]);
                
                if(data){
                    presentAlert({
                        header: "Success",
                        buttons: ['OK']
                    })
                    const data = await db?.query(`
                        SELECT ED.id, 
                        ED.Breeder_Date, ED.animal_id_male,
                        ED.type, ED.status, ED.breeder_id, ED.remarks,
                        P.fname AS breeder_fname, P.lname as breeder_lname,
                        A.name as animal_name
                        FROM Estrus_Details AS ED
                        INNER JOIN Estrus_Head AS EH ON EH.id = ED.Estrus_Head
                        INNER JOIN Person AS P ON P.id = ED.breeder_id
                        INNER JOIN Animal AS A ON A.id = ED.animal_id_male
                        WHERE EH.id = ? AND ED.archive = 0AND ED.archive = 0`, 
                        [EH_id]);
                        console.log(EH_id)
                        setEstrus_Details(data?.values)
                }else{
                    presentAlert({
                        header: "Error",
                        buttons: ['OK']
                    })
                }
            })
         }catch(error){
             console.log((error as Error).message);
            
         }
    }

    const EditData = (eh_id:number) =>{
        setEH_id(eh_id);
        loadEstusDetails(eh_id);
    }

    const selectedEditEDetails = (data:EstrusDetails | undefined)=>{
  
        if(data){
            setSelectedAnimal_id(data.animal_id_male);
            setSelectedBreedType(data.type)
            setSelectedBreeder(data.breeder_id)
            setSelectedRemarks(data.remarks)
            setEH_id(data.eh_id)
        }
        console.log(data)
    }

    
    const modalEsterus = useRef<HTMLIonModalElement>(null);
    return (

        <div className="ion-padding">
             <IonButton expand="full" onClick={()=>InsertEsterusHead(animal_id)}>On Heat now</IonButton>

             {EsterusHead?.map((EH) => {
           
            const date = new Date(EH.dateCreated).toLocaleDateString("en-US", {
                month: "short", 
                day: "numeric",  
                year: "numeric" 
            });

            return (
                <IonItem key={EH.id} id={`EsterusHeader - ${EH.id}`} className="ion-margin-top" onClick={()=>EditData(EH.id)}>
                    <IonLabel><h1>{date} <IonBadge 
                                    color={
                                            EH.status === 'Pregnant' ? 'success' : 
                                            EH.status === 'Failed' ? 'warning' : 
                                            EH.status === 'Pregnant but failed' ? 'danger' :
                                            'primary'
                                        }>{EH.status}</IonBadge></h1></IonLabel>
                </IonItem>
            );
            })}

           {EsterusHead?.map((h)=>(
            <IonModal key={h.id} ref={modalEsterus} trigger={`EsterusHeader - ${h.id}`} initialBreakpoint={1} breakpoints={[0, 1]}>
                <IonContent className="ion-padding">
                    <IonCard>
                        <IonCardHeader className="ion-text-center">
                            <IonCardTitle>Breed</IonCardTitle>
                        </IonCardHeader>
                        <IonCardContent>
                            <IonRow>
                                <IonSelect label="Male Animal" labelPlacement="floating" value={selectedAnimal} onIonChange={(e)=>setSelectedAnimal(e.target.value as number)}>
                                    {animal?.map((a)=>(
                                    <IonSelectOption key={a.id} value={a.id}>{a.name}</IonSelectOption>
                                ))}
                                </IonSelect>
                            </IonRow> 
                            <IonRow>
                            <IonSelect label="Type" labelPlacement="floating" value={selectedType} onIonChange={(e)=>setSelectedType(e.target.value as string)}>
                                    <IonSelectOption>Natural</IonSelectOption>
                                    <IonSelectOption>Unnatural</IonSelectOption>
                                </IonSelect>
                            </IonRow>
                            <IonRow>
                            <IonSelect label="Breeder" labelPlacement="floating" value={breeder} onIonChange={(e)=>setBreeder(e.target.value as number)}>
                                {BreederData?.map((br)=>(
                                    <IonSelectOption key={br.id} value={br.id}>{br.fname} {br.lname}</IonSelectOption>
                                ))}
                                
                                   
                                </IonSelect>
                            </IonRow>
                            <IonRow>
                                <IonInput label="Remarks" labelPlacement="floating" value={remarks} onIonInput={(e)=>setRemarks(e.target.value as string)}> 

                                </IonInput>
                            </IonRow>
                            <IonButton expand="full" className="ion-margin-top" onClick={() => InsertEstrusDetails(EH_id, selectedAnimal, selectedType, remarks, breeder)} disabled={h.status === 'Pregnant' || h.status === 'Failed' || h.status === 'Given Birth'} >Insert</IonButton>
                        </IonCardContent>
                    </IonCard>
                    {Estrus_Details?.map((ed)=>{
                         const date = new Date(ed.Breeder_Date).toLocaleDateString("en-US", {
                            month: "short", 
                            day: "numeric",  
                            year: "numeric" 
                        });
                        return (
                        <IonItem key={ed.id}>
                            <IonItemSliding>
                                <IonItemOptions side="end">
                                    <IonItemOption color="white" id={`edit${ed.id}`} onClick={()=>selectedEditEDetails(ed)}><IonIcon slot="icon-only" icon={createOutline} ></IonIcon></IonItemOption>
                                    <IonItemOption color="success" ><IonIcon slot="icon-only" icon={checkmark} onClick={()=>setPregnant(ed.id, EH_id)}></IonIcon></IonItemOption>
                                    <IonItemOption color="warning"><IonIcon slot="icon-only" icon={alertOutline} onClick={()=>setFailed(ed.id)}></IonIcon></IonItemOption>
                                    <IonItemOption color="danger" ><IonIcon slot="icon-only" icon={closeOutline} onClick={()=>archiveED(ed.id)}></IonIcon></IonItemOption>
                                </IonItemOptions>
                                <IonItem>
                                    <IonLabel><h1>{date} <IonBadge color={
                                            ed.status === 'Pregnant' ? 'success' : 
                                            ed.status === 'Failed' ? 'warning' : 
                                            ed.status === 'Pregnant but failed' ? 'danger' :
                                            'primary'
                                        }>
                                                {ed.status}
                                    </IonBadge>
                            </h1><small>Male: {ed.animal_name}</small> | <small>Remarks: {ed.remarks} </small> | <small>type: {ed.type}</small></IonLabel>
                                </IonItem>
                            </IonItemSliding>
                        </IonItem>
                        )
                    })}
                    {Estrus_Details?.map((em)=>(
                        <IonModal key={em.id} ref={modalEsterus} trigger={`edit${em.id}`} initialBreakpoint={0.7} breakpoints={[0, 1]}>
<IonCard>
                        <IonCardHeader className="ion-text-center">
                            <IonCardTitle>Breed</IonCardTitle>
                        </IonCardHeader>
                        <IonCardContent>
                            <IonRow>
                                <IonSelect label="Male Animal" labelPlacement="floating" value={selectedAnimal_id} onIonChange={(e)=>setSelectedAnimal_id(e.target.value as number)}>
                                    {animal?.map((a)=>(
                                    <IonSelectOption key={a.id} value={a.id}>{a.name}</IonSelectOption>
                                ))}
                                </IonSelect>
                            </IonRow> 
                            <IonRow>
                            <IonSelect label="Type" labelPlacement="floating" value={selectedBreedType} onIonChange={(e)=>setSelectedBreedType(e.target.value as string)} >
                                    <IonSelectOption>Natural</IonSelectOption>
                                    <IonSelectOption>Unnatural</IonSelectOption>
                                </IonSelect>
                            </IonRow>
                            <IonRow>
                            <IonSelect label="Breeder" labelPlacement="floating" value={selectedBreeder} onIonChange={(e)=>setSelectedBreeder(e.target.value as number)}>
                                {BreederData?.map((br)=>(
                                    <IonSelectOption key={br.id} value={br.id}>{br.fname} {br.lname}</IonSelectOption>
                                ))}
                                
                                   
                                </IonSelect>
                            </IonRow>
                            <IonRow>
                                <IonInput label="Remarks" labelPlacement="floating" value={selectedRemarks} onIonInput={(e)=>setSelectedRemarks(e.target.value as string)}> 

                                </IonInput>
                            </IonRow>
                            <IonButton expand="full" className="ion-margin-top" onClick={()=>UpdateEstrusDetails(selectedAnimal_id, selectedBreedType, selectedBreeder, selectedRemarks, em.id)}>Update</IonButton>
                        </IonCardContent>
                    </IonCard>
                        </IonModal>
                    ))}
                </IonContent>
            </IonModal>
           ))}
        </div>

        
           
    );
}

export default Estrus;
