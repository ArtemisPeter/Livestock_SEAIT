import {
    IonPage,
    IonContent,
    IonGrid,
    IonRow,
    IonCol,
    useIonAlert,
  } from "@ionic/react";
  import React, { useState } from "react";
  import "./Home.css";
  import { SQLiteDBConnection } from "@capacitor-community/sqlite";
  import useSQLiteDB from "../composables/useSQLiteDB";
  import { useHistory } from "react-router";
  import ReactCodeInput from "react-code-input";
  import logo from '../assets/icon.png'
  
  type SQLItem = {
    id: number;
    fname: string;
    lname: string;
    pinCode: number;
  };
  
  const Login: React.FC = () => {
    const [pin, setPin] = useState<string>(""); 
    const { performSQLAction } = useSQLiteDB();
    const [presentAlert] = useIonAlert();
    const history = useHistory();
  
    const CheckUser = async (pin: string) => {
      try {
        await performSQLAction(async (db: SQLiteDBConnection | undefined) => {
          if (!db) {
            //console.log("Database connection is undefined");
            return;
          }
    
          try {
            const numUser = await db.query(`SELECT COUNT(*) AS count FROM User`);
            const userCount = numUser?.values?.[0]?.count || 0; // Get count safely
    
            if (userCount > 1) {
              await db.query(`DELETE FROM User`);
            } else if (userCount === 0) {
           
              await db.query(
                `INSERT OR IGNORE INTO User (fname, lname, pincode) 
                 VALUES ('Admin', 'istrator', 1234)`
              );
            }
          } catch (error) {
            console.log("Error in user count query:", error);
          }
    
          try {
            const result = await db.query(`SELECT pincode FROM User WHERE pincode = ?`, [pin]);
    
            if (result?.values?.length > 0) {
              const dbPin = parseInt(result.values[0].pincode, 10);
              const inputPin = parseInt(pin, 10); 
              
              //alert(`Pin: ${typeof dbPin}, Inputted Pin: ${typeof inputPin}`)

              if (dbPin === inputPin) {
                history.push("/landing");
              } else {
                presentAlert({
                  header: "Login Failed!",
                  buttons: ["OK"],
                });
              }
            } else {
              presentAlert({
                header: "Login Failed!",
                buttons: ["OK"],
              });
            }
          } catch (error) {
            console.log("Error in login query:", error);
          }
        });
      } catch (error) {
        console.log("Error in performSQLAction:", error);
      }
    };
    
  
    const handlePinChange = (value: string) => {
      setPin(value);
      if (value.length === 4) {
        CheckUser(value);
      }
    };
  
    return (
      <IonPage>
        <IonContent fullscreen className="ion-padding">
          <IonGrid>
            <IonRow>
              <IonCol
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  height: "100vh",
                }}
              >
                <img src={logo} style={{ width: "50%" }} alt="Logo" />
                <p>Log in using your Passkey</p>
                <div className="ion-margin-top">
                  <ReactCodeInput
                    type="password"
                    fields={4}
                    name={"pin"}
                    inputMode={"tel"}
                    value={pin}
                    onChange={handlePinChange} 
                  />
                </div>
              </IonCol>
            </IonRow>
          </IonGrid>
        </IonContent>
      </IonPage>
    );
  };
  
  export default Login;
  