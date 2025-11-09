import { useState } from "react"
import SectionName from "../../../components/dashboard/SectionName"
import { AtendenteInfo } from "./data/atendenteInterfaces"
import UtilizadoresList from "./UtilizadoresList"
import NovoUtilizador from "./NovoUtilizador"

const UtilizadoresView = () => {


    return <>
        <SectionName>
            Utilizadores
        </SectionName>
        <NovoUtilizador />

        <section id="utilizadores" className="pt-3">
            <div className="container-fluid">
                <div className="row">
                    <UtilizadoresList />
                </div>
            </div>
        </section>
    </>
}

export default UtilizadoresView;
