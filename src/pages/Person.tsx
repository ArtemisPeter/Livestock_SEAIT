import React, { useEffect, useRef, useState } from "react";
import SideBar from "./SideBar";
import { IonButton, IonButtons, IonCard, IonCardHeader, IonCardSubtitle, IonCardTitle, IonCol, IonContent, IonFab, IonFabButton, IonHeader, IonIcon, IonInput, IonMenuButton, IonModal, IonPage, IonRow, IonSelect, IonSelectOption, IonTitle, IonToolbar, useIonAlert } from "@ionic/react";
import { add } from "ionicons/icons";
import { SQLiteDBConnection } from "@capacitor-community/sqlite";
import useSQLiteDB from "../composables/useSQLiteDB";

type Persons = {
    id: number, 
    fname: string,
    lname: string,
    role_id: number,
    role: string
}

type Role = {
    id: number,
    role: string
}


const Person: React.FC = () => {
    const [fname, setFname] = useState("");
    const [lname, setLname] = useState("");
    const [role, setRole] = useState(0);
    const [personData, setPersonData] = useState<Array<Persons>>();
    const {performSQLAction, initialized} = useSQLiteDB();
    const [roleData, setRoleData] = useState<Array<Role>>();
    const [presentAlert] = useIonAlert();

    //separate fname etc. for displaying to the card and for input...
    
    useEffect(()=>{
        loadPerson();
        loadRole();
    }, [initialized])


    const loadPerson = () =>{
        try{
            performSQLAction(async(db:SQLiteDBConnection | undefined)=>{
                const data = await db?.query(`SELECT P.id, P.fname, P.lname, P.role_id, R.role FROM Person AS P
                    INNER JOIN Role AS R ON R.id = P.role_id
                    `);
                setPersonData(data?.values);
            })
        }catch(error){
            console.log((error as Error).message);
            setPersonData([]);
        }
    }

    const loadRole = () =>{
        try{
            performSQLAction(async(db:SQLiteDBConnection | undefined)=>{
                const roles = await db?.query(`SELECT * FROM Role`);
                setRoleData(roles?.values);
            })
        }catch(error){
            console.log((error as Error).message);
            setRole(0);
        }
    }

    const insertPerson = (fname:string, lname:string, role_id:number) =>{
        if(fname == null || lname == null || role_id == 0){
            presentAlert({
                header: "Empty",
                buttons: ['OK']
            })
        }else{
            try{
                performSQLAction(async(db:SQLiteDBConnection | undefined)=>{
                    const newP = await db?.query(`INSERT INTO Person (fname, lname, role_id) VALUES (?, ?, ?)`, [
                        fname, lname, role_id
                    ])
                    if(newP){
                        presentAlert({
                            header: "Success",
                            buttons: ['OK']
                        })
                        const data = await db?.query(`SELECT P.id, P.fname, P.lname, P.role_id, R.role FROM Person AS P
                            INNER JOIN Role AS R ON R.id = P.role_id
                            `);
                        setPersonData(data?.values);
                        setFname("");
                        setLname("");
                        setRole(0);
                        await db?.execute('COMMIT');
                       
                    }else{
                        presentAlert({
                            header: "Error",
                            buttons: ['OK']
                        })
                    }
                })
            }catch(error){
                console.log((error as Error).message)
            }
        }
        clearData()

    }

    const updatePerson = (fname:string, lname:string, role_id:number, id: number) =>{
        if(fname == null || lname == null  || id == null){
            presentAlert({
                header: "Empty",
                buttons: ['OK']
            })
        }else{
            try{
                performSQLAction(async(db:SQLiteDBConnection | undefined)=>{
                    const newP = await db?.query(`UPDATE Person SET fname = ?, lname = ?, role_id = ? WHERE id = ?`, [
                        fname, lname, role_id, id
                    ])
                    if(newP){
                        presentAlert({
                            header: "Success",
                            buttons: ['OK']
                        })
                        //clearData()
                        const data = await db?.query(`SELECT P.id, P.fname, P.lname, P.role_id, R.role FROM Person AS P
                            INNER JOIN Role AS R ON R.id = P.role_id
                            `);
                        setPersonData(data?.values);
                        await db?.execute('COMMIT');
                        
                    }else{
                        presentAlert({
                            header: "Error",
                            buttons: ['OK']
                        })
                    }
                })
            }catch(error){
                console.log((error as Error).message)
            }
        }

        //clearData()
    }
    const clearData = () =>{
        console.log("Clicked")
        setFname("");
        setLname("");
        setRole(0);
    }

    const editData = (data: Persons | undefined) =>{
        if(data){
            setFname(data.fname);
            setLname(data.lname);
            setRole(data.role_id);
        }else{
            clearData();
        }
    }
    const modal = useRef<HTMLIonModalElement>(null);
    const modal2 = useRef<HTMLIonModalElement>(null);
    return(
        <>
            <SideBar />
            <IonPage id="main-content">
                <IonHeader>
                    <IonToolbar>
                        <IonButtons slot="start">
                            <IonMenuButton></IonMenuButton>
                        </IonButtons>
                        <IonTitle>Person</IonTitle>
                    </IonToolbar>
                </IonHeader>
                <IonContent className="ion-padding">

                    {personData?.map((p)=>(
                        <IonCard key={p.id} id={`cardPerson-${p.id}`} onClick={()=>editData(p)}>
                            <IonCardHeader>
                                <IonCardTitle>{`${p.fname} ${p.lname}`}</IonCardTitle>
                                <IonCardSubtitle>{p.role}</IonCardSubtitle>
                            </IonCardHeader>
                        </IonCard>
                    ))}

                    {personData?.map((m)=>(
                         <IonModal key={m.id} ref={modal} trigger={`cardPerson-${m.id}`} initialBreakpoint={0.6} breakpoints={[0, 1]}>
                         <IonContent className="ion-padding">
                             <IonRow>
                                 <IonCol className="ion-text-center">
                                     <h2>Edit {m.fname} {m.lname} </h2>
                                 </IonCol>
                             </IonRow>
                             <IonRow>
                                 <IonCol>
                                     <IonInput
                                         label="First Name"
                                         labelPlacement="floating"
                                         value={fname}
                                         onIonInput={(e)=>setFname(e.target.value as string)}
                                     ></IonInput>
                                 </IonCol>
                                 <IonCol>
                                     <IonInput
                                         label="Last Name"
                                         labelPlacement="floating"
                                         value={lname}
                                         onIonInput={(e)=>setLname(e.target.value as string)}
                                     ></IonInput>
                                 </IonCol>
                             </IonRow>
                             <IonRow>
                                 <IonCol>
                                     <IonSelect label="Role" labelPlacement="floating" value={role} onIonChange={(e)=>setRole(e.target.value as number)}>
                                         {roleData?.map((r)=>(
                                             <IonSelectOption key={r.id} value={r.id}>{r.role}</IonSelectOption>
                                         ))}
                                     </IonSelect>
                                 </IonCol>
                             </IonRow>
                             <IonButton expand="block" className="ion-margin-top" onClick={()=>updatePerson(fname, lname, role, m.id)}> Update </IonButton>
                         </IonContent>
                     </IonModal>
                    ))}

                <IonModal ref={modal2} trigger="addPerson" initialBreakpoint={0.6} breakpoints={[0, 1]}>
                 
                    <IonContent className="ion-padding">
                        <IonRow>
                            <IonCol className="ion-text-center">
                                <h2>Add Person</h2>
                            </IonCol>
                        </IonRow>
                        <IonRow>
                            <IonCol>
                                <IonInput
                                    label="First Name"
                                    labelPlacement="floating"
                                    value={fname}
                                    onIonInput={(e)=>setFname(e.target.value as string)}
                                ></IonInput>
                            </IonCol>
                            <IonCol>
                                <IonInput
                                    label="Last Name"
                                    labelPlacement="floating"
                                    value={lname}
                                    onIonInput={(e)=>setLname(e.target.value as string)}
                                ></IonInput>
                            </IonCol>
                        </IonRow>
                        <IonRow>
                            <IonCol>
                                <IonSelect label="Role" labelPlacement="floating" value={role} onIonChange={(e)=>setRole(e.target.value as number)}>
                                    {roleData?.map((r)=>(
                                        <IonSelectOption key={r.id} value={r.id}>{r.role}</IonSelectOption>
                                    ))}
                                </IonSelect>
                            </IonCol>
                        </IonRow>
                        <IonButton expand="block" className="ion-margin-top" onClick={()=>insertPerson(fname, lname, role)}> Save</IonButton>
                    </IonContent>
                </IonModal>

                </IonContent>
                <IonFab id ="addPerson" slot="fixed" vertical="bottom" horizontal="end">
                    <IonFabButton>
                        <IonIcon icon={add} onClick={()=>clearData()}></IonIcon>
                    </IonFabButton>
                </IonFab>
            </IonPage>
        </>
    )
}
export default Person