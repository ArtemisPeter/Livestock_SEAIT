import { IonPage, IonHeader, IonToolbar, IonButtons, IonMenuButton, IonTitle, IonContent, IonBadge, IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonFab, IonFabButton, IonIcon, IonModal, IonInput, IonLabel, IonRow, IonCol, IonButton, IonAlert, useIonAlert, IonSelect, IonSelectOption, IonCardSubtitle } from "@ionic/react";
import React, { useEffect, useRef, useState } from "react";
import SideBar from "./SideBar";
import { add } from "ionicons/icons";
import { SQLiteDBConnection } from "@capacitor-community/sqlite";
import useSQLiteDB from "../composables/useSQLiteDB";

type SQLItem = {
    id: number;
    Breed: string;
    Animal_Type_id: number
}

type AnimalCategories = {
    id: number;
    type: string;
    gestation_period: number
}

type TypeWithCategory = {
    id: number,
    breed: string;
    type: string;
    Animal_Type_id: number;
    gestation_period: number
}

const AddAnimalType: React.FC = () => {
    const [Breed, setBreed] = useState("");
    const [animal_id, setAnimal_id] = useState(0);
    const { performSQLAction, initialized } = useSQLiteDB();
    const [presentAlert] = useIonAlert();
    const [Categories, setCategories] = useState<Array<AnimalCategories>>()
    const [Animals, setAnimals] = useState<Array<TypeWithCategory>>()

    useEffect(()=>{
        loadCategoriesWithBreed();
        loadAnimalCategories();
        
    }, [initialized])

    const eraseData = async ()=>{
        setBreed("");
        setAnimal_id(0);
        loadAnimalCategories()
    }

    const loadAnimalCategories = async () =>{
        try{
            performSQLAction(async(db:SQLiteDBConnection | undefined)=>{
                const data = await db?.query(`SELECT * FROM Animal_Type`);
                setCategories(data?.values);
                
            })
        }catch(error){
            console.log((error as Error).message);
            setCategories([]);
        }
    }

    const loadCategoriesWithBreed = async () =>{
        try{
            performSQLAction(async(db:SQLiteDBConnection | undefined)=>{
                const data2 = await db?.query(`SELECT Breed.id, Breed.breed, Animal_Type.type, Breed.Animal_Type_id, Animal_Type.gestation_period FROM Breed INNER JOIN Animal_Type ON Animal_Type.id = Breed.Animal_Type_id`);
                setAnimals(data2?.values);
                await db?.execute('COMMIT')
                console.log(data2)
            })
        }catch(error){
            console.log((error as Error).message);
            setAnimals([]);
        }
    }

    const AddAnimalType = async (Breed:string, animal_type_id:number) =>{
        if(Breed == "" || Breed == undefined || animal_type_id == 0 || animal_type_id == undefined){
            presentAlert({
                header: "EMPTY!",
                buttons: ['OK']
            })
        }else{
            try{
                performSQLAction(
                    async(db:SQLiteDBConnection | undefined)=>{
                      
                       
                        const duplicate = await db?.query(`SELECT * FROM Breed WHERE Breed = ? AND Animal_Type_id = ?`, [
                            Breed, animal_type_id
                        ]);
    
                        if(duplicate && duplicate.values && duplicate.values.length > 0){
                            presentAlert({
                                header: "Duplicate!",
                                buttons: ['OK']
                            })
                        }else{
                            const insert = await db?.query(`INSERT INTO Breed (breed, Animal_Type_id) VALUES (?,?)`, [
                                Breed, animal_type_id
                            ]);
                            if(insert){
                                presentAlert({
                                    header: 'Success!',
                                    buttons: ['OK']
                                });
                            }else{
                                presentAlert({
                                    header: 'ERROR!',
                                    buttons: ['OK']
                                });
                            }
                          
                            const data = await db?.query(`SELECT Breed.breed , Breed.breed , Animal_Type.type, Breed.Animal_Type_id, Animal_Type.gestation_period FROM Breed INNER JOIN Animal_Type ON Animal_Type.id = Breed.Animal_Type_id`);
                            setAnimals(data?.values);
                            console.log(data)
                            
                            await db?.execute('COMMIT')
                        }
                    }
                )
            }catch(error){
                console.log((error as Error).message);
                setBreed("");
                setAnimal_id(0);
            }
        }
        
    }

    const doEditType = (data: TypeWithCategory | undefined)=>{
        if(data){
            setBreed(data.breed);
            setAnimal_id(data.Animal_Type_id)
            console.log(data)
            loadAnimalCategories()
        }else{
            setBreed("");
            setAnimal_id(0);
        }
    }

    const updateType = (Breed: string, animal_id: number, id: number) => {
        try{
            performSQLAction(
                async(db: SQLiteDBConnection | undefined)=>{
                    const updateData = await db?.query(`UPDATE Breed SET breed = ?, Animal_Type_id = ? WHERE id = ?`, [
                        Breed, animal_id, id
                    ]);

                    presentAlert({
                        header: 'Success!',
                        buttons: ['OK']
                       });
                       
                       const data = await db?.query(`SELECT Breed.id, Breed.Breed, Animal_Type.type, Breed.Animal_Type_id, Animal_Type.gestation_period FROM Breed INNER JOIN Animal_Type ON Animal_Type.id = Breed.Animal_Type_id`);
                       setAnimals(data?.values);
                       await db?.execute('COMMIT')
                           eraseData();
                          
                }
            )

        }catch(error){
            console.log((error as Error).message);
            eraseData()
        }
    }

    const modal = useRef<HTMLIonModalElement>(null);

    return(
        <>
         <SideBar />
      <IonPage id="main-content">
        <IonHeader>
          <IonToolbar>
            <IonButtons slot="start">
              <IonMenuButton></IonMenuButton>
            </IonButtons>
            <IonTitle>Animal Type</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent className="ion-padding">

        {Animals?.map((dbCat) => (
    <IonCard key={`${dbCat.id}-${dbCat.breed}`} id={`card-${dbCat.breed}`} onClick={() => doEditType(dbCat)}>
        <IonCardHeader>
            <IonCardTitle>{dbCat.breed}</IonCardTitle>
            <IonCardSubtitle>{dbCat.type}</IonCardSubtitle>
        </IonCardHeader>
    </IonCard>
))}

{Animals?.map((dbType) => (
    <IonModal
        ref={modal}
        key={`${dbType.id}-${dbType.breed}`}  // Combined key for uniqueness
        trigger={`card-${dbType.breed}`}
        initialBreakpoint={0.7}
        breakpoints={[0, 1]}
    >
        <IonContent className="ion-padding">
            <IonRow>
                <IonCol className="ion-text-center">
                    <h2>Edit {dbType.breed}</h2>
                </IonCol>
            </IonRow>
            <IonRow className="ion-margin-bottom">
                <IonInput
                    label="Breed Name"
                    labelPlacement="floating"
                    value={Breed}
                    onIonInput={(e) => setBreed(e.target.value as string)}
                />
            </IonRow>
            <IonRow>
                <IonSelect
                    label="Category"
                    labelPlacement="floating"
                    value={animal_id}
                    onIonChange={(e) => setAnimal_id(e.target.value as number)}
                >
                    {Categories?.map((cat) => (
                        <IonSelectOption value={cat.id} key={cat.id}>{cat.type}</IonSelectOption>
                    ))}
                </IonSelect>
            </IonRow>
            <IonButton expand="block" className="ion-margin-top" onClick={() => updateType(Breed, animal_id, dbType.id)}>
                Update
            </IonButton>
        </IonContent>
    </IonModal>
))}


           
        <IonModal ref={modal} trigger="addType" initialBreakpoint={0.7} breakpoints={[0, 1]}>

                <IonContent className="ion-padding">
                    <IonRow>
                        <IonCol className="ion-text-center">
                            <h2>Add Breed</h2>
                        </IonCol>
                       
                    </IonRow>
                    <IonRow className="ion-margin-bottom">
                        <IonInput
                           label="Breed Name"
                           labelPlacement="floating"
                           value={Breed}
                           onIonInput={(e)=>setBreed(e.target.value as string)}
                        ></IonInput>
                    </IonRow>
                    <IonRow>
                        <IonSelect label="Category" labelPlacement="floating" value={animal_id} onIonChange={(e)=>setAnimal_id(e.target.value as number)}>
                           {Categories?.map((cat)=>(
                            <IonSelectOption value={cat.id} key={cat.id}>{cat.type}</IonSelectOption>
                           ))}
                        </IonSelect>
                    </IonRow>
                   
                    <IonButton expand="block" className="ion-margin-top" onClick={()=>AddAnimalType(Breed, animal_id)}>Add</IonButton>
                </IonContent>
                
               </IonModal>

        <IonFab id="addType" slot="fixed" vertical="bottom" horizontal="end">
            <IonFabButton>
                <IonIcon icon={add} onClick={eraseData}></IonIcon>
            </IonFabButton>
            
        </IonFab>
        </IonContent>
        
      </IonPage>
    </>

    );
}
export default AddAnimalType