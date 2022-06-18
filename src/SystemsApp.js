import React, {Component} from 'react'

class SystemListHeaderFloor extends Component {

    render(){
        return(
            <thead>
            <tr className="table_header_row">
                <th >Descrição</th>
                <th></th>
            </tr>
            </thead>
        )
    }

}

class SystemListHeaderWall extends Component {

    render(){
        return(
            <thead>
            <tr className="table_header_row">
                <th className="table_first_colun">Descrição</th>
                <th className="table_second_colun">Marca</th>
                <th>ρ (kg/m³)</th>
                <th>s' (N/m²)</th>
                <th>Tipo</th>
                <th></th>
            </tr>
            </thead>
        )
    }

}

class SystemListBodyFloor extends Component {

    render(){

        const {systemData, removeSystem} = this.props

        const floorSystem = systemData.filter(element =>(element.categ === 'floor'))
        
        const rows = floorSystem.map((row, index) => {

            const descTxt = row.desc.replace(/\n/g, '<br>')

            

            return (
              <tr key={index} name={index}>
                <td>
                    <div>
                        <div className="systemInfoTxt">
                            {row.name} <br></br>
                           
                        </div>

                        <div className="systemInfoTxt">
                            Tipo: {row.type == 'wframe' ? 'Wood Frame' : 'outro'} <br></br>
                            Transmissão: {row.transm == 'inner' ? 'transmissão por folha' : 'transmissão por completo'}<br></br>
                            f<sub>c</sub>: {row.fc} Hz<br></br>
                        </div>

                        <div className="systemInfoTxt">
                        Marca/Ref: {row.brand} <br></br>
                            Descrição: <span id={'desc_floor_'+index}> {descTxt} </span> <br></br>
                        </div>
                    </div>
                    <div>
                        <div>
                            <div className="systemAvTxt">f (Hz)</div>
                            <div className="systemAvTxt">50  </div>
                            <div className="systemAvTxt">63  </div>
                            <div className="systemAvTxt">80  </div>
                            <div className="systemAvTxt">100 </div>
                            <div className="systemAvTxt">125 </div>
                            <div className="systemAvTxt">160 </div>
                            <div className="systemAvTxt">200 </div>
                            <div className="systemAvTxt">250 </div>
                            <div className="systemAvTxt">315 </div>
                            <div className="systemAvTxt">400 </div>
                            <div className="systemAvTxt">500 </div>
                            <div className="systemAvTxt">630 </div>
                            <div className="systemAvTxt">800 </div>
                            <div className="systemAvTxt">1000</div>
                            <div className="systemAvTxt">1250</div>
                            <div className="systemAvTxt">1600</div>
                            <div className="systemAvTxt">2000</div>
                            <div className="systemAvTxt">2500</div>
                            <div className="systemAvTxt">3150</div>
                            <div className="systemAvTxt">4000</div>
                            <div className="systemAvTxt">5000</div>
                        </div>
                        <div>
                            <div className="systemAvTxt">R (dB)</div>
                            <div className="systemAvTxt">{row.R[0] }</div>
                            <div className="systemAvTxt">{row.R[1] }</div>
                            <div className="systemAvTxt">{row.R[2] }</div>
                            <div className="systemAvTxt">{row.R[3] }</div>
                            <div className="systemAvTxt">{row.R[4] }</div>
                            <div className="systemAvTxt">{row.R[5] }</div>
                            <div className="systemAvTxt">{row.R[6] }</div>
                            <div className="systemAvTxt">{row.R[7] }</div>
                            <div className="systemAvTxt">{row.R[8] }</div>
                            <div className="systemAvTxt">{row.R[9] }</div>
                            <div className="systemAvTxt">{row.R[10]}</div>
                            <div className="systemAvTxt">{row.R[11]}</div>
                            <div className="systemAvTxt">{row.R[12]}</div>
                            <div className="systemAvTxt">{row.R[13]}</div>
                            <div className="systemAvTxt">{row.R[14]}</div>
                            <div className="systemAvTxt">{row.R[15]}</div>
                            <div className="systemAvTxt">{row.R[16]}</div>
                            <div className="systemAvTxt">{row.R[17]}</div>
                            <div className="systemAvTxt">{row.R[18]}</div>
                            <div className="systemAvTxt">{row.R[19]}</div>
                            <div className="systemAvTxt">{row.R[20]}</div>
                        </div>
                        <div>
                            <div className="systemAvTxt">Ln (dB)</div>
                            <div className="systemAvTxt">{row.Ln[0] }</div>
                            <div className="systemAvTxt">{row.Ln[1] }</div>
                            <div className="systemAvTxt">{row.Ln[2] }</div>
                            <div className="systemAvTxt">{row.Ln[3] }</div>
                            <div className="systemAvTxt">{row.Ln[4] }</div>
                            <div className="systemAvTxt">{row.Ln[5] }</div>
                            <div className="systemAvTxt">{row.Ln[6] }</div>
                            <div className="systemAvTxt">{row.Ln[7] }</div>
                            <div className="systemAvTxt">{row.Ln[8] }</div>
                            <div className="systemAvTxt">{row.Ln[9] }</div>
                            <div className="systemAvTxt">{row.Ln[10]}</div>
                            <div className="systemAvTxt">{row.Ln[11]}</div>
                            <div className="systemAvTxt">{row.Ln[12]}</div>
                            <div className="systemAvTxt">{row.Ln[13]}</div>
                            <div className="systemAvTxt">{row.Ln[14]}</div>
                            <div className="systemAvTxt">{row.Ln[15]}</div>
                            <div className="systemAvTxt">{row.Ln[16]}</div>
                            <div className="systemAvTxt">{row.Ln[17]}</div>
                            <div className="systemAvTxt">{row.Ln[18]}</div>
                            <div className="systemAvTxt">{row.Ln[19]}</div>
                            <div className="systemAvTxt">{row.Ln[20]}</div>
                        </div>
                    </div>
                    
                </td>
         
                <td><img className="imge_act" src="./_imge/_icons/delete_red.svg" onClick={() => removeSystem(index,row.categ)} alt="Remover material" /></td>
              </tr>
            )
          })

        return(<tbody>{rows}</tbody>)
        

    }

}

class SystemListBodyWall extends Component {

    render(){

        const {materialData, removeMaterial} = this.props

        const floatMaterials = materialData.filter(element =>(element.categ === 'float'))
        
        const rows = floatMaterials.map((row, index) => {
            return (
              <tr key={index} className="table_row" name={index}>
                <td className="table_first_colun">{row.name}</td>
                <td className="table_second_colun">{row.brand}</td>
                <td className="table_colun">{row.density}</td>
                <td className="table_colun">{row.ym}</td>
                <td className="table_colun">{row.tp}</td>
                <td className="table_colun"><img className="imge_act" src="./_imge/_icons/delete_red.svg" onClick={() => removeMaterial(index,row.categ)}  alt="Remover material" /></td>
              </tr>
            )
          })

        return(<tbody>{rows}</tbody>)
        

    }

}

class MaterialFormHeavy extends Component{

    initialState = {
        categ: 'heavy',
		name: '',
		brand: '',
		density: '',
		ym: undefined,
		pm: undefined,
		wave: '',
        loss: '',
        ide: '',
    }
    
    state = this.initialState

    handleChange = (event) => {
        const {name, value} = event.target
      
        this.setState({
          [name]: value,
        })
      }
    
    submitForm = () => {

        this.state.ide = this.props.materialData.length + 1

        this.props.handleSubmit(this.state)
        
        this.setState(this.initialState)

        
      }

    render(){

        

        const {categ,name,brand,density,ym,	pm,	wave,loss} = this.state
        
        return(
            <form>
                <table>
                    <tbody>
                        <tr id="input_material" className="table_row">
                            <td className="table_first_colun"><input
                                type="text"
                                name="name"
                                id="material_name"
                                className="material_list_input"
                                placeholder="Descrição"
                                value={name}
                                onChange = {this.handleChange}
                                /></td>
                            
                            <td className="table_second_colun"><input
                                type="text"
                                name="brand"
                                id="material_brand"
                                className="material_list_input"
                                placeholder="Marca"
                                value={brand}
                                onChange = {this.handleChange} 
                                /></td>

                            <td className="table_colun"><input
                                type="number"
                                name="density"
                                id="material_density"
                                className="material_list_input"
                                placeholder="ρ (kg/m³)"
                                value={density}
                                onChange = {this.handleChange} 
                                /></td>
                                
                            <td className="table_colun"><input
                                type="number"
                                name="wave"
                                id="material_wave"
                                className="material_list_input"
                                placeholder="CL (m/s)"
                                value={wave}
                                onChange = {this.handleChange}
                                /></td>

                            <td className="table_colun"><input
                                type="number"
                                name="loss"
                                id="material_loss"
                                className="material_list_input"
                                placeholder="ηi"
                                value={loss}
                                onChange = {this.handleChange}
                                /></td>

                            <td className="table_colun">
                                <img src="./_imge/_icons/add_green.svg" className="imge_act" onClick = {this.submitForm} alt="Remover material" />
                            </td>
                        </tr>
                    </tbody>
                </table>    
            </form>
        )
    }
}

class MaterialFormFloat extends Component{

    initialState = {
        categ: 'float',
		name: '',
		brand: '',
		density: '',
		ym: '',
        tp: '',
      }
    
    state = this.initialState

    handleChange = (event) => {
        const {name, value} = event.target
      
        this.setState({
          [name]: value,
        })
      }
    
    submitForm = () => {

        this.state.ide = this.props.materialData.length + 1

        this.props.handleSubmit(this.state)

        this.setState(this.initialState)
      }

    render(){

        const {categ,name,brand,density,ym,	tp} = this.state
        
        return(
            <form>
                <table>
                    <tbody>
                        <tr id="input_material" className="table_row">
                            <td className="table_first_colun"><input
                                type="text"
                                name="name"
                                id="material_name"
                                className="material_list_input"
                                placeholder="Descrição"
                                value={name}
                                onChange = {this.handleChange}
                                /></td>
                            
                            <td className="table_second_colun"><input
                                type="text"
                                name="brand"
                                id="material_brand"
                                className="material_list_input"
                                placeholder="Marca"
                                value={brand}
                                onChange = {this.handleChange} 
                                /></td>

                            <td className="table_colun"><input
                                type="number"
                                name="density"
                                id="material_density"
                                className="material_list_input"
                                placeholder="ρ (kg/m³)"
                                value={density}
                                onChange = {this.handleChange} 
                                /></td>
                                
                            <td className="table_colun"><input
                                type="number"
                                name="ym"
                                id="material_ym"
                                className="material_list_input"
                                placeholder="s' (N/m²)"
                                value={ym}
                                onChange = {this.handleChange}
                                /></td>

                            <td className="table_colun"><select
                                type="select"
                                name="tp"
                                id="material_tp"
                                className="material_list_input"
                                onChange = {this.handleChange}>
                                    <option disabled selected>Selecione</option>
                                    <option value='sand'>Arenoso/cimentício ou cálcio-sulfato</option>
                                    <option value='asphalt'>Asfaltico/Seco</option>
                                </select></td>

                            <td className="table_colun">
                                <img src="./_imge/_icons/add_green.svg" className="imge_act" onClick = {this.submitForm} alt="Novo material"/>
                            </td>
                        </tr>
                    </tbody>
                </table>    
            </form>
        )
    }
}

class SystemList extends Component {

    constructor(props){
        super(props);
        this.state ={
          materials: this.props.materialData,
          systems: this.props.systemData}
      }

    //  checkCookies={this.checkCookies} setCookie={this.setCookie}

    removeMaterial = (index,categ) => {
        const {materials} = this.state

        const dataFilter = materials.filter(element =>(element.categ === categ))

        const dataPush =  materials.filter(element =>(element.categ !== categ))

        const dataResult = dataFilter.filter((character, i) => {
            return i !== index
          }).concat(dataPush)
          
        this.setState({
            materials: dataResult,
        })

        this.props.updateState('materials',dataResult)

     //   this.props.setCookie('database_materials','[{obj1},{obj2}]')
        
      }
      
    handleSubmit = (newMaterial) => {

        this.setState({materials: [...this.state.materials, newMaterial]})

        
       this.props.updateState('materials',[...this.state.materials, newMaterial])
      }

    render(){
        return (
            <div>
                <div className="table_title">Sistemas de piso</div>
                <table className="table_list">
                    <SystemListHeaderFloor />
                    <SystemListBodyFloor systemData={this.state.systems} materialData={this.state.materials} removeMaterial={this.removeMaterial}/>
                </table>

                <div className="table_title">Sistemas de parede</div>
                <table className="table_list">
                    <SystemListHeaderWall />
                    <SystemListBodyWall systemData={this.state.systems} materialData={this.state.materials} removeMaterial={this.removeMaterial}/>
                </table>
                <div>
                <MaterialFormFloat handleSubmit={this.handleSubmit} materialData={this.state.materials}/>
                </div>

                <label className="minilabel">Descrição: nome/descrição do material | Marca: referência/marca do material | ρ: denidade (Kg/m³) | C<sub>L</sub>: velocidade de propagação da onda (m/s) | η<sub>i</sub>: coeficiente de amortecimento interno | s': coeficiente de rigidez dinâmica (MN/m³)</label>
            </div>
        )
    }

}

export default SystemList;