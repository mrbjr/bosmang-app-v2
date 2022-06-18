import React, {Component} from 'react'
import database from './scripts'
import MaterialsList from './MaterialsApp'
import SystemList from './SystemsApp'
import ElementsApp from './ElementsApp'
import ResultsApp from './ResultsApp'

class AppDisplay extends Component {
    constructor(props){
        super(props);

            this.state = {
                materials: database.materials,
                systems: database.systems,
                x: 0,
                y: 0,
                z1: 0,
                z2: 0,

                element_floor_material: {ide: 0},
                element_floor_thin: 0,
                element_slab_material: {ide: 0},
                element_slab_thin: 0,
                element_float_material: {
                    tp: 'sand',
                    categ: 'float',
                    name: 'Piso Zero',
                    brand: 'zero',
                    density: 0,
                    ym: 0,
                    tp: 'sand', //sand ou asphalt
                    ide: 2,},
                element_float_thin: 0,

                side_a: {
                    psup: {
                        material: {ide: 0},
                        thin: 0,
                    },
                    pinf:{
                        material: 0,
                        thin: 0,
                        clone: true,
                    },
                    padc:{ //piso adicional (qundo junção for X)
                        material: 0,
                        thin: 0,
                        clone: true,
                    },
                   },

                side_b: {
                    psup: {
                        material: {ide: 0},
                        thin: 0,
                    },
                    pinf:{
                        material: 0,
                        thin: 0,
                        clone: true,
                    },
                    padc:{ //piso adicional (qundo junção for X)
                        material: 0,
                        thin: 0,
                        clone: true,
                    },
                   },

                side_c: {
                    psup: {
                        material: {ide: 0},
                        thin: 0,
                    },
                    pinf:{
                        material: 0,
                        thin: 0,
                        clone: true,
                    },
                    padc:{ //piso adicional (qundo junção for X)
                        material: 0,
                        thin: 0,
                        clone: true,
                    },
                   },

                side_d: {
                    psup: {
                        material: {ide: 0},
                        thin: 0,
                    },
                    pinf:{
                        material: 0,
                        thin: 0,
                        clone: true,
                    },
                    padc:{ //piso adicional (qundo junção for X)
                        material: 0,
                        thin: 0,
                        clone: true,
                    },
                   },

                side_a_junction: 0,
                side_b_junction: 0,
                side_c_junction: 0,
                side_d_junction: 0,

                junctionsGroup: [undefined,undefined,undefined,undefined],
                junctionsWalls: [undefined,undefined,undefined,undefined],
            }
            
        }

    updateState = (stateName,data) => {
        this.setState({
            [stateName]: data,
        })
    }

    render(){

        const {materials, systems,
                x,y,z1,z2,
                element_floor_material,element_floor_thin,
                element_slab_material,element_slab_thin,
                element_float_material,element_float_thin,

                side_a, side_b, side_c, side_d,
                
                side_a_junction,
                side_b_junction,
                side_c_junction,
                side_d_junction,

                junctionsGroup,
                junctionsWalls,

            } = this.state


        const activeApp = this.props.activeApp

        switch(activeApp){
            case 'Materiais':
                return <MaterialsList materialData={materials} updateState={this.updateState}/>

            case 'Sistemas':
                return <SystemList systemData={systems} materialData={materials} updateState={this.updateState}/>

            case 'Elementos':
                return <ElementsApp materialData={materials}
                                    updateState={this.updateState}
                                    update3level={this.update3level}
                                    x={x} y={y} z1={z1} z2={z2}
                                    
                                    element_floor_material={element_floor_material}
                                    element_floor_thin={element_floor_thin}
                                    element_slab_material={element_slab_material}
                                    element_slab_thin={element_slab_thin}
                                    element_float_material={element_float_material}
                                    element_float_thin={element_float_thin}

                                    side_a={side_a} side_b={side_b} side_c={side_c} side_d={side_d}
                                    
                                    side_a_junction={side_a_junction}
                                    side_b_junction={side_b_junction}
                                    side_c_junction={side_c_junction}
                                    side_d_junction={side_d_junction}

                                    junctionsGroup={junctionsGroup}
                                    junctionsWalls={junctionsWalls}

                                    />

            case 'Junções':
                return 'junctions'

            case 'Resultados':
                return <ResultsApp materialData={materials}
                updateState={this.updateState}
                x={x} y={y} z1={z1} z2={z2}
                
                element_floor_material={element_floor_material}
                element_floor_thin={element_floor_thin}
                element_float_material={element_float_material}
                element_slab_material={element_slab_material}
                element_slab_thin={element_slab_thin}

                side_a={side_a} side_b={side_b} side_c={side_c} side_d={side_d}
                
                side_a_junction={side_a_junction}
                side_b_junction={side_b_junction}
                side_c_junction={side_c_junction}
                side_d_junction={side_d_junction}

                junctionsGroup={junctionsGroup}
                junctionsWalls={junctionsWalls}

                />

            default:
                return <div><h3 class="welcome">Seja bem-vindo/a ao Projeto Bosmang. </h3> <br></br>
                Desenvolvido através de pesquisa do financiamento CAPES do programa de pós graduação em Engenharia Civil FECFAU Unicamp.<br></br>
                Autores: <a href="http://lattes.cnpq.br/1872610155432586" target="_blank">BARBIERE JÚNIOR, M. R.</a>; <a href="http://lattes.cnpq.br/4517016873176660" target="_blank">BERTOLI, S. R.</a> <br></br>
                Contato: m208267@dac.unicamp.br; rolla@fec.unicamp.br<br></br>
                Icones: Freepik. <br></br> 
                Imagens: Unsplash. <br></br>

                <p><h3 class="welcome">Notas de atualização: </h3><br></br>
                14/04/2022 - v 2.9.0: Correção na redução sonora de camadas resilientes em flancos de ruído aéreo. Correção na densidade volumétrica do ar. Otimização de alguns algoritmos.<br></br>
                14/12/2021 - v 2.8.1: Ajustes para baixas frequências em ruído de impacto dentro de ΔL;<br></br>
                10/12/2021 - v 2.8.0: Melhorias na estimativa de R, Ln e ΔL, ajustes de propriedades da lista de materiais;<br></br>
                19/11/2021 - v 2.7.0: Kij para frequencias baixas, médias e altas aplicado no cálculo de Dvij. Correções para R estimado. Adição de novos sistemas;<br></br>
                17/11/2021 - v 2.5.5: alterações na visualização de resultados, alteração na precisão do número ponderado (ISO 717) e adição do termo de adaptação de espectro para Dntw (ISO 717-1); <br></br>
                08/11/2021 - v 2.5.2: alteração na precisão do número ponderado (ISO 717);<br></br>
                28/10/2021 - v 2.5.1: correção no cálculo de D<sub>nt,w</sub> e adição de materiais;<br></br>
                27/10/2021 - v 2.5.0: correção na inserção de piso flutuante; <br></br>
                15/09/2021 - v 2.3.1: correção do resultado L<sub>n,W</sub>.
                </p>
                <a rel="license" href="http://creativecommons.org/licenses/by-nc-sa/4.0/"><img alt="Licença Creative Commons" src="https://i.creativecommons.org/l/by-nc-sa/4.0/88x31.png" /></a><br />Este obra está licenciado com uma Licença <a rel="license" href="http://creativecommons.org/licenses/by-nc-sa/4.0/">Creative Commons Atribuição-NãoComercial-CompartilhaIgual 4.0 Internacional</a>.
                </div>
        }

    }

}

export default AppDisplay;