import { useState } from "react"
import SectionName from "../../../components/dashboard/SectionName"
import { AtendenteInfo } from "./data/atendenteInterfaces"
import UtilizadoresList from "./UtilizadoresList"
import NovoUtilizador from "./NovoUtilizador"

const UtilizadoresView = () => {
    return (
        <>
            <section id="utilizadores-view" className="col pt-3 px-3">
                <SectionName
                    align="center"
                    withIcon="bi-people"
                    subtitle="Gerencie os utilizadores do sistema"
                >
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
            </section>
        </>
    )
}

export default UtilizadoresView
