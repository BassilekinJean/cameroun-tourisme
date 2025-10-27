import { useKeycloak } from "@react-keycloak/web";
import { useEffect, useState } from "react";

type Car = {
  nomComplet: string;
  email: string;
  paysOrigine: string;
  photoProfile: string;
};
const Cars = () => {
  const { keycloak } = useKeycloak();
  const [cars, setCars] = useState<Car[]>([]);
  useEffect(() => {
    const getData = async () => {
      try {
        if (keycloak && keycloak.authenticated) {
          await keycloak?.updateToken();
          const req = await fetch("http://localhost:8080/api/user/1", {
            headers: {
              ["Authorization"]: `Bearer ${keycloak.token}`,
            },
          });
          setCars(await req.json());
        }
      } catch (e) {
        console.log("ERROR", e);
      }
    };
    getData();
  }, [keycloak]);
  return (
    <>
      <div style={{ marginTop: "20px" }}>
        {cars.map((car) => (
          <div key={car.nomComplet} style={{ padding: "10px", marginBottom: "20px" }}>
            <span>
              {car.nomComplet} - {car.email} | price: {car.paysOrigine}
            </span>
          </div>
        ))}
      </div>
      <button
        type="button"
        className="text-blue-800"
        onClick={() => keycloak.logout()}
      >
        Logout ({keycloak?.tokenParsed?.preferred_username})
      </button>
    </>
  );
};
export default Cars;