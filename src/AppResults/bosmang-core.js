import React, {Component} from 'react'

function log10(x) {return Number(Math.LOG10E*Math.log(x))};

const c0 = 340 // velocidade de propagação do som no ar
const p0 = 1.19;
const freq = [50,63,80,100,125,160,200,250,315,400,500,630,800,1000,1250,1600,2000,2500,3150,4000,5000];//21 [0~20]
const fref = 1000;
const doCorrection = 1;
const kijsim = 1;

function tabajara(W,type){
	var C = type.slice(0,1) === "L" ? [62,62,62,62,62,62,61,60,59,58,57,54,51,48,45,42] : [33,36,39,42,45,48,51,52,53,54,55,56,56,56,56,56];
	var R = (Number(Math.abs(W[0])) === 0) || (W[0] === Infinity) || (W[0] === null || isNaN(W[0]) == true) ? 32 : 0;
   // console.log(W)
    //console.log(R)
	var n = 0;
    var k = type.slice(0,1) === "L" ? 1 : -1
	var Lnsum=0;
	var Lnsum2=0;
	var diff = 0.1;
    var count = 0;
	while ((32-R>=diff)||(R-32>0)) {
		
		//FUNÇÃO DELTA
		var sW=0;
		var D = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
		for (var i=0;i<freq.length-5;i++){
			D[i] = (W[i+3]-C[i])*k;
			if (D[i]>0){sW = sW + D[i]}
		}
		//FIM FUNÇÃO DELTA

			R = sW;
		
		if (((32-R)>=diff)||((R-32)>0)){

			//FUNÇÃO VERIFICAR
			if (sW<32) {n=-0.01*k};
			if (sW>32) {n=0.01*k};
			if (sW==32) {n=0*k};
			//FIM FUNÇÃO VERIFICAR
			
			//FUNÇÃO REAJUSTE
			for (var i=0;i<freq.length-5;i++){
				C[i] = C[i]+n;	
			}
		}
        count = count + 1
        if (count > 5000){ diff = 0.2 }
        if (count > 8000){ diff = 0.5 }
        if (count > 12000){ diff = 1 }
	}
	var Nw=W[0] === (0||Infinity||null||false) ? 0 :C[7];  

    ////// parte adicional

	if (type.slice(0,1) === "L") {
        for (var i=0;i<freq.length-5;i++){
            var Lnsum = Lnsum + Math.pow(10,0.1*W[i+3]);
        }
	
        for (var i=0;i<freq.length-2;i++){
            var Lnsum2 = Lnsum2 + Math.pow(10,0.1*W[i]);
        }
            var Ci = 10*log10(Lnsum)-15-Nw;
            var Ci2 = 10*log10(Lnsum2)-15-Nw;
            if (Ci>=0){Ci = Ci+0.5} else {Ci = Ci-0.5};
            Ci = Math.trunc(Ci);
            if (Ci2>=0){Ci2 = Ci2+0.5} else {Ci2 = Ci2-0.5};
            Ci2 = Math.trunc(Ci2);
            Nw=parseInt(C[7]*10+0.5)/10;
          //  console.log ("L : count= " + count + " | diff= "+ diff + " | sW="+ sW)
    } else {

            var Cc = [-29,-26,-23,-21,-19,-17,-15,-13,-12,-11,-10,-9,-9,-9,-9,-9];
            var Ccr = 0;
            var Cctr = [-20,-20,-18,-16,-15,-14,-13,-12,-11,-9,-8,-9,-10,-11,-13,-15];
            var Cctrr = 0;
            Nw=parseInt(C[7]*10+0.5)/10;

            for (var i=0; i<freq.length-5;i++){
                Ccr = Ccr + Math.pow(10,(Cc[i]-W[i+3])/10)
                Cctrr = Cctrr + Math.pow(10,(Cctr[i]-W[i+3])/10)
            }

            var Ci = -10*log10(Ccr) - Nw;
            var Ci2 = -10*log10(Cctrr) - Nw;

            if (Ci>=0){Ci = Ci+0.5} else {Ci = Ci-0.5};
            Ci = Math.trunc(Ci);
            if (Ci2>=0){Ci2 = Ci2+0.5} else {Ci2 = Ci2-0.5};
            Ci2 = Math.trunc(Ci2);

         //   console.log ("D/R : count= " + count + " | diff= "+ diff + " | sW="+ sW)
    }
		//doChart(C,W,freq,Ci,Ci2);  */
        if ((Number(Math.abs(W[0])) === 0) || (W[0] === Infinity) || (W[0] === null) || (isNaN(W[0]) == true)) {
            return [0,0,0]
        } else {
            return [Nw,Ci,Ci2]
        }
}


class BosmangCore extends Component {

    constructor(props){
        super(props);
        this.state ={

            junctionsGroup: this.props.junctionsGroup,
            junctionsWalls: this.props.junctionsWalls,

            prediction: {
                L: undefined,
                LnT: undefined,
                LnTw: undefined,
                Lnw: undefined,
                R_: undefined,
            },

            floor: {
                material: this.props.element_floor_material, // NÃO USADO???
                x: Number(this.props.x),
                y: Number(this.props.y),
                thin: Number(this.props.element_floor_thin),
                density: Number(this.props.element_floor_material.density), //me
                cl: Number(this.props.element_floor_material.wave),
                nint: Number(this.props.element_floor_material.loss),
            },

            float: {
        
                mass: {
                    material: this.props.element_slab_material,
                    thin: Number(this.props.element_slab_thin),
                    density: Number(this.props.element_slab_material.density), //me
                },

                spring: {
                    material: this.props.element_float_material,
                    ym: Number(this.props.element_float_material.ym),
                    tp: this.props.element_float_material.tp,
                },

            },

            side_a_psup: {
                material: this.props.side_a['psup']['material'], // NÃO USADO???
                x: Number(this.props.y),
                y: Number(this.props.z1),
                thin: Number(this.props.side_a['psup']['thin']),
                density: Number(this.props.side_a['psup']['material'].density), //me
                cl: Number(this.props.side_a['psup']['material'].wave),
                nint: Number(this.props.side_a['psup']['material'].loss),
            },

            side_a_pinf: {
                material: this.props.side_a['pinf']['material'], // NÃO USADO???
                x: Number(this.props.y),
                y: Number(this.props.z2),
                thin: Number(this.props.side_a['pinf']['thin']),
                density: Number(this.props.side_a['pinf']['material'].density), //me
                cl: Number(this.props.side_a['pinf']['material'].wave),
                nint: Number(this.props.side_a['pinf']['material'].loss),
            },

            side_a_padc: {
                material: this.props.side_a['padc']['material'], // NÃO USADO???
                x: Number(this.props.x),
                y: Number(this.props.y),
                thin: Number(this.props.side_a['padc']['thin']),
                density: Number(this.props.side_a['padc']['material'].density), //me
                cl: Number(this.props.side_a['padc']['material'].wave),
                nint: Number(this.props.side_a['padc']['material'].loss),
            },

            side_b_psup: {
                material: this.props.side_b['psup']['material'], // NÃO USADO???
                x: Number(this.props.x),
                y: Number(this.props.z1),
                thin: Number(this.props.side_b['psup']['thin']),
                density: Number(this.props.side_b['psup']['material'].density), //me
                cl: Number(this.props.side_b['psup']['material'].wave),
                nint: Number(this.props.side_b['psup']['material'].loss),
            },

            side_b_pinf: {
                material: this.props.side_b['pinf']['material'], // NÃO USADO???
                x: Number(this.props.x),
                y: Number(this.props.z2),
                thin: Number(this.props.side_b['pinf']['thin']),
                density: Number(this.props.side_b['pinf']['material'].density), //me
                cl: Number(this.props.side_b['pinf']['material'].wave),
                nint: Number(this.props.side_b['pinf']['material'].loss),
            },

            side_b_padc: {
                material: this.props.side_b['padc']['material'], // NÃO USADO???
                x: Number(this.props.x),
                y: Number(this.props.y),
                thin: Number(this.props.side_b['padc']['thin']),
                density: Number(this.props.side_b['padc']['material'].density), //me
                cl: Number(this.props.side_b['padc']['material'].wave),
                nint: Number(this.props.side_b['padc']['material'].loss),
            },

            side_c_psup: {
                material: this.props.side_c['psup']['material'], // NÃO USADO???
                x: Number(this.props.y),
                y: Number(this.props.z1),
                thin: Number(this.props.side_c['psup']['thin']),
                density: Number(this.props.side_c['psup']['material'].density), //me
                cl: Number(this.props.side_c['psup']['material'].wave),
                nint: Number(this.props.side_c['psup']['material'].loss),
            },

            side_c_pinf: {
                material: this.props.side_c['pinf']['material'], // NÃO USADO???
                x: Number(this.props.y),
                y: Number(this.props.z2),
                thin: Number(this.props.side_c['pinf']['thin']),
                density: Number(this.props.side_c['pinf']['material'].density), //me
                cl: Number(this.props.side_c['pinf']['material'].wave),
                nint: Number(this.props.side_c['pinf']['material'].loss),
            },

            side_c_padc: {
                material: this.props.side_c['padc']['material'], // NÃO USADO???
                x: Number(this.props.x),
                y: Number(this.props.y),
                thin: Number(this.props.side_c['padc']['thin']),
                density: Number(this.props.side_c['padc']['material'].density), //me
                cl: Number(this.props.side_c['padc']['material'].wave),
                nint: Number(this.props.side_c['padc']['material'].loss),
            },

            side_d_psup: {
                material: this.props.side_d['psup']['material'], // NÃO USADO???
                x: Number(this.props.x),
                y: Number(this.props.z1),
                thin: Number(this.props.side_d['psup']['thin']),
                density: Number(this.props.side_d['psup']['material'].density), //me
                cl: Number(this.props.side_d['psup']['material'].wave),
                nint: Number(this.props.side_d['psup']['material'].loss),
            },

            side_d_pinf: {
                material: this.props.side_d['pinf']['material'], // NÃO USADO???
                x: Number(this.props.x),
                y: Number(this.props.z2),
                thin: Number(this.props.side_d['pinf']['thin']),
                density: Number(this.props.side_d['pinf']['material'].density), //me
                cl: Number(this.props.side_d['pinf']['material'].wave),
                nint: Number(this.props.side_d['pinf']['material'].loss),
            },

            side_d_padc: {
                material: this.props.side_d['padc']['material'], // NÃO USADO???
                x: Number(this.props.x),
                y: Number(this.props.y),
                thin: Number(this.props.side_d['padc']['thin']),
                density: Number(this.props.side_d['padc']['material'].density), //me
                cl: Number(this.props.side_d['padc']['material'].wave),
                nint: Number(this.props.side_d['padc']['material'].loss),
            },

            junction_a : {
                type: this.props.side_a_junction,
            },
            
            junction_b : {
                type: this.props.side_b_junction,
            },
            
            junction_c : {
                type: this.props.side_c_junction,
            },
                    
            junction_d : {
                type: this.props.side_d_junction,
            },

            junction_1 : {
                type: this.props.junctionsWalls[0],
            },
            
            junction_2 : {
                type: this.props.junctionsWalls[1],
            },
            
            junction_3 : {
                type: this.props.junctionsWalls[2],
            },
            
            junction_4 : {
                type: this.props.junctionsWalls[3],
            },
            
            junction_5 : {
                type: this.props.junctionsWalls[0],
            },
            
            junction_6 : {
                type: this.props.junctionsWalls[1],
            },
            
            junction_7 : {
                type: this.props.junctionsWalls[2],
            },
            
            junction_8 : {
                type: this.props.junctionsWalls[3],
            },

            flank_a : {}, flank_b : {}, flank_c : {}, flank_d : {},

            flank_floor_floor: {},

            flank_00 : {},
            
            
        }
      }

    handleChange = (event) => {
        const {name, value} = event.target
      
        this.setState({
          [name]: value,
        })

        this.props.updateState([name],value)
      }

    verifyStats = () => {
        if (this.state.side_a_psup.thin === 0 || this.state.side_a_psup.material.ide === 0 ||
            this.state.side_a_pinf.thin === 0 || this.state.side_a_pinf.material.ide === 0 ||
            this.state.side_a_padc.thin === 0 || this.state.side_a_padc.material.ide === 0 ) this.state.flank_a.kij = [undefined]
        
        if (this.state.side_b_psup.thin === 0 || this.state.side_b_psup.material.ide === 0 ||
            this.state.side_b_pinf.thin === 0 || this.state.side_b_pinf.material.ide === 0 ||
            this.state.side_b_padc.thin === 0 || this.state.side_b_padc.material.ide === 0 ) this.state.flank_b.kij = [undefined]

        if (this.state.side_c_psup.thin === 0 || this.state.side_c_psup.material.ide === 0 ||
            this.state.side_c_pinf.thin === 0 || this.state.side_c_pinf.material.ide === 0 ||
            this.state.side_c_padc.thin === 0 || this.state.side_c_padc.material.ide === 0 ) this.state.flank_c.kij = [undefined]

        if (this.state.side_d_psup.thin === 0 || this.state.side_d_psup.material.ide === 0 ||
            this.state.side_d_pinf.thin === 0 || this.state.side_d_pinf.material.ide === 0 ||
            this.state.side_d_padc.thin === 0 || this.state.side_d_padc.material.ide === 0 ) this.state.flank_d.kij = [undefined]
    }

      elementSi = (element) => {return element.x*element.y}
      elementl1 = (element) => {return Math.max(element.x,element.y)}
      elementl2 = (element) => {return Math.min(element.x,element.y)}
      elementsmass = (element) => {return element.density*element.thin/1000} // mlinha
      elementfc = (element) => {return Math.pow(c0,2)/(1.8*element.cl*element.thin/1000)}
      elementfc_eff = (element) => {return freq.map((freq) => {return element.fc*((4.05*0.001*element.thin*freq/element.cl)+Math.sqrt(1+Math.pow(4.05*0.001*element.thin*freq/element.cl,2)))})}
      elementf11 = (element) =>  {return (Math.pow(c0,2)/(4*element.fc))*((1/Math.pow(element.l1,2))+(1/Math.pow(element.l2,2)))}
      elementsigma1 = (element) =>  {return freq.map((freq)=>{return 1/Math.sqrt(1-element.fc/freq)})}
      elementsigma2 = (element) =>  {return freq.map((freq)=>{return 4*element.l1*element.l2*Math.pow(freq/c0,2)})}
      elementsigma3 = (element) =>  {return freq.map((freq)=> {return Math.sqrt((2*Math.PI*freq*(element.l1+element.l2))/(16*c0))})}
      elementsigma = (element) =>  {return freq.map((freq,index)=>{
          
          if (element.f11 > element.fc/2){
              if (freq < element.fc){
                  return Math.min(2,element.sigma2[index] < element.sigma3[index] ? element.sigma2[index] : element.sigma3[index]) 
              } else if (freq > element.fc){
                  return Math.min(2,element.sigma1[index] < element.sigma3[index] ? element.sigma1[index] : element.sigma3[index])
              } else {return Math.min(2,element.sigma3[index])}
          } else {
              var sigma0 = undefined
              if (freq>=element.fc){
                  sigma0 = element.sigma1[index]
              } else {
                  var Y = Math.sqrt(freq/element.fc)
                  var S1 = ((1-Math.pow(Y,2))*Math.log((1+Y)/(1-Y))+2*Y)/(4*Math.pow(Math.PI,2)*Math.pow(1-Y*Y,1.5))
                  var S2 = freq <= element.fc/2 ? (8*Math.pow(c0,2)*(1-2*Math.pow(Y,2)))/(Math.pow(element.fc,2)*Math.pow(Math.PI,4)*element.l1*element.l2*Y*Math.sqrt(1-Math.pow(Y,2))) : 0
                  sigma0 = (2*(element.l1+element.l2)*c0*S1)/(element.l1*element.l2*element.fc)+S2
              }
              if (freq<element.f11 && element.f11<element.fc/2 && sigma0>element.sigma2[index]) {return Math.min(2,element.sigma2[index])} else {return Math.min(2,sigma0)};
          }
      })}

    elementsigmaf = (element) => {return freq.map((freq)=>{
        var k0 = (2*Math.PI*freq)/c0;
        var A = -0.964-(0.5+(element.l2/(Math.PI*element.l1)))*Math.log(element.l2/element.l1)+((5*element.l2)/(2*Math.PI*element.l1))-(1/(4*Math.PI*element.l1*element.l2*Math.pow(k0,2)));
        var sigmaf = 0.5*(Math.log(k0*Math.sqrt(element.l1*element.l2))-A);
        return Math.min(sigmaf,2);
    })}
    
    elementQui = (element) => {return Math.sqrt(31.1/element.fc)}
    
    elementPsi = (element) => {return 44.3*element.fc/element.smass}
    
    elementAlpha = (element) => {return (1/3)*Math.pow((2*Math.sqrt(element.Qui*element.Psi)*(1+element.Qui)*(1+element.Psi))/(element.Qui*Math.pow(1+element.Psi,2)+2*element.Psi*(1+Math.pow(element.Qui,2))),2)}
    
    elementAlphaK = (element) => {return element.Alpha*(1-0.9999*element.Alpha)}
    
    elementntotlab = (element) => {return freq.map((freq,index)=>{return element.nint+((2*p0*c0*element.sigma[index])/(2*Math.PI*freq*element.smass))+(c0/(Math.pow(Math.PI,2)*element.Si*Math.sqrt(freq*element.fc)))*(2*(element.l1+element.l2)*element.AlphaK)})}

    elementTs = (ntot) =>{
        return freq.map((freq,index)=>{return 2.2/(freq*ntot[index])})
    }

    elementR = (element,ntot) => { return freq.map((freq,index)=>{
        var t1 = Math.pow((1*p0*c0)/(1*Math.PI*freq*element.smass),2);
        var tplat = Math.pow((4*p0*c0)/(1.1*element.density*element.cl),2)*(0.02/ntot[index])
        var tt = ''
        var fc_ = element.fc > freq ? element.fc : element.fc_eff[index]
        var adj_a = element.fc >= freq ? 8 : 0;
        var adj_b = 0;
    
        var f1 = (2*freq)/(1+Math.pow(2,1/3))
        var f2 = f1*Math.pow(2,1/3)

         //   if (freq < 200) {adj_b = 6}

            if (freq==400){ adj_b = -2}

            if (freq==500){ adj_b = -2}

            if (freq==630){ adj_b = -2}

            if (freq>630 && freq < 1250){ adj_b = -3}

            if (freq == 1250) {adj_b = -2}

            if (freq > 1250) {adj_b = -4}

       
        if (freq>element.fc){
            tt = t1*((Math.PI*fc_*Math.pow(element.sigma[index],2))/(2*freq*ntot[index]));
        }
        
        if (freq<element.fc){
            tt = t1*(2*element.sigmaf[index]*Math.pow(((1-(Math.pow(freq,2)))/Math.pow(fc_,2)),-2)+((2*Math.PI*fc_*Math.pow(element.sigma[index],2))/(4*freq*ntot[index])));
        }
        
        if (element.fc>f1 && element.fc<f2) {
            tt = t1*((Math.PI*Math.pow(element.sigma[index],2))/(2*ntot[index]));
            adj_b = 0;
        }
    
        var Ss = element.sigma[index]
        var r = (Math.PI*element.fc*element.sigma[index])/(4*freq*element.ntotlab[index])
        var Sa = (element.sigmaf[index]+r*element.sigma[index])/(1+r)

        if (doCorrection == 0) {adj_a=0; adj_b=0}
    
        return Math.min(-10*log10(tt),-10*log10(tplat))+adj_a+10*log10(Ss/Sa)+adj_b
    })}

   /* elementRo = (element) => { return freq.map((freq,index)=>{
        var Ss = element.sigma[index]
        var r = (Math.PI*element.fc*element.sigma[index])/(4*freq*element.ntotlab[index])
        var Sa = (element.sigmaf[index]+r*element.sigma[index])/(1+r)
        console.log(10*log10(Ss/Sa))
        return element.Rlab[index]+10*log10(Ss/Sa)
    })
        
    }*/

    elementLn = (element,ts) =>{return freq.map((freqs,index)=>{
        var adj_a = 0;

        if (freqs==1600){
                adj_a = +0;
        }
        if (freqs>1600){
                adj_a = -2*(index-16)
        }
        
        if (doCorrection == 0) { adj_a = 0 }
            
        return 155-(30*log10(element.smass))+(10*log10(ts[index]))+(10*log10(element.sigma[index]))+(10*log10(freqs/fref))+adj_a
    })}

    elementLnsitu = (element) => {return freq.map((freq,index)=>{return element.Llab[index] + log10(element.Tssitu[index]/element.Tslab[index])})}

    elementRsitu = (element) => {return freq.map((freq,index)=>{return element.Rlab[index] - log10(element.Tssitu[index]/element.Tslab[index])})}

    elementsigmaf = (element) => {return freq.map((freq)=>{
    var k0 = (2*Math.PI*freq)/c0;
    var A = -0.964-(0.5+(element.l2/(Math.PI*element.l1)))*Math.log(element.l2/element.l1)+((5*element.l2)/(2*Math.PI*element.l1))-(1/(4*Math.PI*element.l1*element.l2*Math.pow(k0,2)));
    var sigmaf = 0.5*(Math.log(k0*Math.sqrt(element.l1*element.l2))-A);
    return Math.min(sigmaf,2);
    })}

    elementQui = (element) => {return Math.sqrt(31.1/element.fc)}

    elementPsi = (element) => {return 44.3*element.fc/element.smass}

    elementAlpha = (element) => {return (1/3)*Math.pow((2*Math.sqrt(element.Qui*element.Psi)*(1+element.Qui)*(1+element.Psi))/(element.Qui*Math.pow(1+element.Psi,2)+2*element.Psi*(1+Math.pow(element.Qui,2))),2)}

    elementAlphaK = (element) => {return element.Alpha*(1-0.9999*element.Alpha)}

    elementEaklk = (side) => {switch (side){
//----------------------------------------------------------------------------------------------------------------------------//

        case "e":
        return this.state.junction_a.aklk[0] + this.state.junction_b.aklk[0] + this.state.junction_c.aklk[0] + this.state.junction_d.aklk[0];

//----------------------------------------------------------------------------------------------------------------------------//
                                                                
        case "a_psup":
        return 2*this.state.junction_a.aklk[1] + this.state.junction_1.aklk[1] + this.state.junction_4.aklk[1];                                                                                                 
                                                                
        case "b_psup":
        return 2*this.state.junction_b.aklk[1] + this.state.junction_1.aklk[1] + this.state.junction_2.aklk[1];                                                                                 
                                                        
        case "c_psup":  
        return 2*this.state.junction_c.aklk[1] + this.state.junction_2.aklk[1] + this.state.junction_3.aklk[1];                                       	                                    
                                                        
        case "d_psup":   
        return 2*this.state.junction_d.aklk[1] + this.state.junction_3.aklk[1] + this.state.junction_4.aklk[1];	

//----------------------------------------------------------------------------------------------------------------------------//

        case "a_pinf":
        return 2*this.state.junction_a.aklk[1] + this.state.junction_5.aklk[1] + this.state.junction_8.aklk[1];                                                                                                 
                                                                
        case "b_pinf":
        return 2*this.state.junction_b.aklk[1] + this.state.junction_5.aklk[1] + this.state.junction_6.aklk[1];                                                                                 
                                                        
        case "c_pinf":  
        return 2*this.state.junction_c.aklk[1] + this.state.junction_6.aklk[1] + this.state.junction_7.aklk[1];                                       	                                    
                                                        
        case "d_pinf":   
        return 2*this.state.junction_d.aklk[1] + this.state.junction_7.aklk[1] + this.state.junction_8.aklk[1];

 //----------------------------------------------------------------------------------------------------------------------------//       
        default:
        return console.log("elementEaklk error side: " + side)

        }
    }

    elementntotsitu = (element) => {
        return freq.map((freq,index) => {return element.nint+((2*p0*c0*element.sigma[index])/(2*Math.PI*freq*element.smass))+(c0/(Math.pow(Math.PI,2)*element.Si*Math.sqrt(freq*element.fc)))*(element.Eaklk)})
    }

    elementAi = (element,ts) => {
        return freq.map((freq,index) => {return ((2.2*Math.pow(Math.PI,2)*element.Si)/(c0*ts[index]))*Math.sqrt(1000/freq)} )
    }

    floatf0 = (element) => {return 160*Math.sqrt(element.spring.ym/element.smass) || 10000000000}

    floatd = (element) => { 

        var adj_a = 0;
        var adj_b = 0;
        var adj_c = 0;
    
        return freq.map((freqs,index) => {
    
            var f1 = (2*freqs)/(1+Math.pow(2,1/3))
            var f2 = f1*Math.pow(2,1/3)
    
            var f1b = (2*freq[index+1])/(1+Math.pow(2,1/3))
            var f2b = f1b*Math.pow(2,1/3)
    
            if (element.f0 > f1b && element.f0 <= f2b){
                adj_a = 2
            }
    
            if (element.f0 > f2){
                adj_b = 4
            }
    
            if (element.f0 > 5600){
                adj_a = 0;
                adj_b = 0;
                adj_c = 0;
            }

            if (freq[index] == 200 && element.f0 >= 5600){
                adj_c = 3;
            }
    
            if (freq[index] < 200 && element.f0 >= 5600){
                adj_c = 6;
            }

            if (doCorrection == 0) {adj_a=0; adj_b=0; adj_c=0}
        
        switch (element.spring.tp){
        case 'sand':
            return Math.max(30*log10(freqs/element.f0),adj_a+adj_b+adj_c);

        case 'asphalt':
            return Math.max(40*log10(freqs/element.f0),adj_a+adj_b+adj_c);
        };
    })
}

    junctionrmass = (element,junction) => {

        var junction_type = junction.type
        var psup = junction.psup
        var pinf = junction.pinf
        var padc = junction.padc

        
            switch (junction_type){
                case "T":
                    var rmass13 = log10((element.smass/((psup.smass+pinf.smass)/2))); 	     // usado no k13
                    var rmass12 = log10(element.smass/psup.smass); 							// usado no k12//21
                    var rmass23 = log10(element.smass/pinf.smass);							// usado no k23
                return [rmass13, rmass12, rmass23];

                case "T2":
                    var rmass13 = log10((((psup.smass+pinf.smass)/2)/element.smass)); 	     // usado no k13
                    var rmass12 = log10(psup.smass/element.smass); 							// usado no k12//21
                    var rmass23 = log10(pinf.smass/element.smass);							// usado no k23
                return [rmass13, rmass12, rmass23];
                
                case "X":
                    var m13 = (element.smass+padc.smass)/2;
                    var m24 = (psup.smass+pinf.smass)/2;
                return [log10(m24/m13),log10(m13/m24)];					//rmass13, 24						// [usar para piso, usar para parede]
                
                default:
                return log10(psup.smass/element.smass); // CRIAR CONDIÇÕES PARA JUNÇÕES L E G
            }

    }

    junctionPC = (element,junction) => {

        var junction_type = junction.type
        var psup = junction.psup
        var pinf = junction.pinf
        var padc = junction.padc

        
            switch (junction_type){
                case "T":
                    var PC13 = ((element.smass/((psup.smass+pinf.smass)/2)) * ((element.thin*element.cl)/(pinf.thin*pinf.cl))); 	     // usado no k13
                    var PC12 = ((element.smass/psup.smass) * ((element.thin*element.cl)/(psup.thin*psup.cl))); 							// usado no k12//21
                    var PC23 = ((element.smass/pinf.smass) * ((element.thin*element.cl)/(pinf.thin*pinf.cl)));							// usado no k23
                return [
                    log10(Math.pow(PC13,3/2)),
                    log10(Math.pow(PC12,3/2)),
                    log10(Math.pow(PC23,3/2))
                ];

                case "T2":
                    var PC13 = ((((psup.smass+pinf.smass)/2)/element.smass) * ((pinf.thin*pinf.cl)/(element.thin*element.cl))) ; 	     // usado no k13
                    var PC12 = ((psup.smass/element.smass) * ((psup.thin*psup.cl)/(element.thin*element.cl))) ; 							// usado no k12//21
                    var PC23 = ((pinf.smass/element.smass) * ((psup.thin*psup.cl)/(element.thin*element.cl))) ;							// usado no k23
                return [
                    log10(Math.pow(PC13,3/2)),
                    log10(Math.pow(PC12,3/2)),
                    log10(Math.pow(PC23,3/2))
                ];
                
                case "X":
                    var m13 = (element.smass+padc.smass)/2; // piso
                    var m24 = (psup.smass+pinf.smass)/2; // parede
                    var PC12 = (m24/m13) * ((pinf.thin*pinf.cl)/(element.thin*element.cl)) //0
                    var PC13 = (m24/m13) * ((pinf.thin*pinf.cl)/(padc.thin*padc.cl)) //0
                    var PC42 = (m13/m24) * ((element.thin*element.cl)/(pinf.thin*pinf.cl)) //1
                    var PC41 = (m13/m24) * ((element.thin*element.cl)/(pinf.thin*pinf.cl)) //1

                    
                return [
                    log10(Math.pow(PC12,3/2)),
                    log10(Math.pow(PC13,3/2)),
                    log10(Math.pow(PC42,3/2)),
                    log10(Math.pow(PC41,3/2))
                ];					                    //rmass13, 24						// [usar para piso, usar para parede]
                
                default:
                    var PC = (psup.smass/element.smass)*((psup.thin*psup.cl)/(element.thin*element.cl))
                return log10(Math.pow(PC,3/2));                                         // CRIAR CONDIÇÕES PARA JUNÇÕES L E G
            }

    }

    junctionY = (junction) =>{
        var junction_type = junction.type
        var PC = junction.PC

        switch (junction_type){
            case "T":
                    var Y13L = -0.30*Math.pow(PC[0],3) + 4.5*Math.pow(PC[0],2) + 7.5*PC[0] + 8.90
                    var Y13M = -0.20*Math.pow(PC[0],3) + 1.3*Math.pow(PC[0],2) + 6.9*PC[0] + 9.10
                    var Y13H = -0.04*Math.pow(PC[0],3) + 1.0*Math.pow(PC[0],2) + 4.5*PC[0] + 5.00

                    var Y12L = -0.40*Math.pow(PC[1],3) + 4.8*Math.pow(PC[1],2) - 1.4*PC[1] + 9.40
                    var Y12M = -0.43*Math.pow(PC[1],3) + 3.8*Math.pow(PC[1],2) - 0.3*PC[1] + 11.5
                    var Y12H = -0.43*Math.pow(PC[1],3) + 3.8*Math.pow(PC[1],2) - 0.3*PC[1] + 11.5

                    var Y23L = -0.40*Math.pow(PC[2],3) + 4.8*Math.pow(PC[2],2) - 1.4*PC[2] + 9.40
                    var Y23M = -0.43*Math.pow(PC[2],3) + 3.8*Math.pow(PC[2],2) - 0.3*PC[2] + 11.5
                    var Y23H = -0.43*Math.pow(PC[2],3) + 3.8*Math.pow(PC[2],2) - 0.3*PC[2] + 11.5

            return [
                [Y13L,Y13M,Y13H], 
                [Y12L,Y12M,Y12H],
                [Y23L,Y23M,Y23H]
            ];

            case "T2":
                    var Y13L = -0.30*Math.pow(PC[0],3) + 4.5*Math.pow(PC[0],2) + 7.5*PC[0] + 8.90
                    var Y13M = -0.20*Math.pow(PC[0],3) + 1.3*Math.pow(PC[0],2) + 6.9*PC[0] + 9.10
                    var Y13H = -0.04*Math.pow(PC[0],3) + 1.0*Math.pow(PC[0],2) + 4.5*PC[0] + 5.00

                    var Y12L = -0.40*Math.pow(PC[1],3) + 4.8*Math.pow(PC[1],2) - 1.4*PC[1] + 9.40
                    var Y12M = -0.43*Math.pow(PC[1],3) + 3.8*Math.pow(PC[1],2) - 0.3*PC[1] + 11.5
                    var Y12H = -0.43*Math.pow(PC[1],3) + 3.8*Math.pow(PC[1],2) - 0.3*PC[1] + 11.5

                    var Y23L = -0.40*Math.pow(PC[2],3) + 4.8*Math.pow(PC[2],2) - 1.4*PC[2] + 9.40
                    var Y23M = -0.43*Math.pow(PC[2],3) + 3.8*Math.pow(PC[2],2) - 0.3*PC[2] + 11.5
                    var Y23H = -0.43*Math.pow(PC[2],3) + 3.8*Math.pow(PC[2],2) - 0.3*PC[2] + 11.5

            return [
                [Y13L,Y13M,Y13H], 
                [Y12L,Y12M,Y12H],
                [Y23L,Y23M,Y23H]
            ];
            
            case "X":
                    var Y12L = -0.50*Math.pow(PC[0],3) + 4.1*Math.pow(PC[0],2) + 1.40*PC[0] + 12.5
                    var Y12M = -0.50*Math.pow(PC[0],3) + 4.1*Math.pow(PC[0],2) + 1.40*PC[0] + 12.5
                    var Y12H = -0.50*Math.pow(PC[0],3) + 4.1*Math.pow(PC[0],2) + 1.40*PC[0] + 12.5

                    var Y13L = -0.20*Math.pow(PC[1],3) + 3.7*Math.pow(PC[1],2) + 10.3*PC[1] + 11.7
                    var Y13M = +0.03*Math.pow(PC[1],3) + 1.8*Math.pow(PC[1],2) + 8.80*PC[1] + 11.4
                    var Y13H = +0.20*Math.pow(PC[1],3) + 1.4*Math.pow(PC[1],2) + 5.90*PC[1] + 7.30

                    var Y42L = -0.20*Math.pow(PC[2],3) + 3.7*Math.pow(PC[2],2) + 10.3*PC[2] + 11.7
                    var Y42M = +0.03*Math.pow(PC[2],3) + 1.8*Math.pow(PC[2],2) + 8.80*PC[2] + 11.4
                    var Y42H = +0.20*Math.pow(PC[2],3) + 1.4*Math.pow(PC[2],2) + 5.90*PC[2] + 7.30

                    var Y41L = -0.50*Math.pow(PC[3],3) + 4.1*Math.pow(PC[3],2) + 1.40*PC[3] + 12.5
                    var Y41M = -0.50*Math.pow(PC[3],3) + 4.1*Math.pow(PC[3],2) + 1.40*PC[3] + 12.5
                    var Y41H = -0.50*Math.pow(PC[3],3) + 4.1*Math.pow(PC[3],2) + 1.40*PC[3] + 12.5


            return [
                [Y12L,Y12M,Y12H],
                [Y13L,Y13M,Y13H],
                [Y42L,Y42M,Y42H],
                [Y41L,Y41M,Y41H]
            ];
            
            case "L":
                    var Y12L  = -0.80*Math.pow(PC,3) + 5*Math.pow(PC,2) + 1.5*PC + 5.9
                    var Y12MH = -0.24*Math.pow(PC,3) + 3*Math.pow(PC,2) + 1.0*PC + 9.5
            return [
                Y12L,
                Y12MH
            ];
            
            case "G":
            return [undefined];
            default:
            return [undefined]
        }
    }

    junctionkij_ = (element,junction) =>{
        
        var Y = junction.Y
        var junction_type = junction.type
        var psup = junction.psup
        var pinf = junction.pinf
        var padc = junction.padc

        switch (junction_type){
            case "T":
                var K13L = Y[0][0] + 5*log10(pinf.fc/1000)
                var K13M = Y[0][1] + 5*log10(pinf.fc/1000)
                var K13H = Y[0][2] + 5*log10(pinf.fc/1000)

                var K12L = Y[1][0] + 5*log10(element.fc/1000)
                var K12M = Y[1][1] + 5*log10(element.fc/1000)
                var K12H = Y[1][2] + 5*log10(element.fc/1000)

                var K23L = Y[2][0] + 5*log10(pinf.fc/1000)
                var K23M = Y[2][1] + 5*log10(pinf.fc/1000)
                var K23H = Y[2][2] + 5*log10(pinf.fc/1000)

            return [
                [K13L,K13M,K13H],
                [K12L,K12M,K12H],
                [K23L,K23M,K23H]
            ];

            case "T2":
                var K13L = Y[0][0] + 5*log10(pinf.fc/1000)
                var K13M = Y[0][1] + 5*log10(pinf.fc/1000)
                var K13H = Y[0][2] + 5*log10(pinf.fc/1000)

                var K12L = Y[1][0] + 5*log10(element.fc/1000)
                var K12M = Y[1][1] + 5*log10(element.fc/1000)
                var K12H = Y[1][2] + 5*log10(element.fc/1000)
                
                var K23L = Y[2][0] + 5*log10(pinf.fc/1000)
                var K23M = Y[2][1] + 5*log10(pinf.fc/1000)
                var K23H = Y[2][2] + 5*log10(pinf.fc/1000)

            return [
                [K13L,K13M,K13H],
                [K12L,K12M,K12H],
                [K23L,K23M,K23H]
            ];
            
            case "X":
                var K12L = Y[0][0] + 5*log10(pinf.fc/1000)
                var K12M = Y[0][1] + 5*log10(pinf.fc/1000)
                var K12H = Y[0][2] + 5*log10(pinf.fc/1000)

                var K13L = Y[1][0] + 5*log10(padc.fc/1000)
                var K13M = Y[1][1] + 5*log10(padc.fc/1000)
                var K13H = Y[1][2] + 5*log10(padc.fc/1000) 

                var K42L = Y[2][0] + 5*log10(pinf.fc/1000)
                var K42M = Y[2][1] + 5*log10(pinf.fc/1000)
                var K42H = Y[2][2] + 5*log10(pinf.fc/1000) 

                var K41L = Y[3][0] + 5*log10(element.fc/1000)
                var K41M = Y[3][1] + 5*log10(element.fc/1000)
                var K41H = Y[3][2] + 5*log10(element.fc/1000)
                return [
                    [K12L,K12M,K12H],
                    [K13L,K13M,K13H],
                    [K42L,K42M,K42H],
                    [K41L,K41M,K41H]
                ];
            
            default:
                var K12L  = Y[0] + 5*log10(psup.fc/1000)
                var K12MH = Y[1] + 5*log10(psup.fc/1000)
            return [
                K12L,
                K12MH
            ];
        }

    }

    junctionkij = (junction) =>{
        var junction_type = junction.type
        var rmass = junction.rmass
        var k12 = 0
        var k13 = 0
        var k23 = 0

    ////////////// INSIERIR IF PARA CONEXÕES RÍGIDAS OU FLEXIVEIS
        switch (junction_type){
            case "T":
                    k13 = 5.7 + 14.1 * rmass[0] + 5.7 * Math.pow(rmass[0],2); 	    //0
            /*k21*/	k12 = 5.7 + 5.7 * Math.pow(rmass[1],2);							//1
                    k23 = 5.7 + 5.7 * Math.pow(rmass[2],2);							//2
            return [k12, k13, k23];//colocar o k23 se for preciso

            case "T2":
                    k13 = 5.7 + 14.1 * rmass[0] + 5.7 * Math.pow(rmass[0],2); 	    //0
            /*k21*/	k12 = 5.7 + 5.7 * Math.pow(rmass[1],2);							//1
                    k23 = 5.7 + 5.7 * Math.pow(rmass[2],2);							//2
            return [k12, k13, k23];//colocar o k23 se for preciso
            
            case "X":
            //analisando o piso
            /*k14*/	k12 = 8.7 + 5.7 * Math.pow(rmass[0],2);							//0
                    k13 = 8.7 + 17.1 * rmass[0] + 5.7 * Math.pow(rmass[0],2);	    //1
            //analisando a parede		
                    var k42 = 8.7 + 17.1 * rmass[1] + 5.7 * Math.pow(rmass[1],2);	    //2					
            /*k12*/	var k41 = 8.7 + 5.7 * Math.pow(rmass[1],2);							//3
            return [k12, k13, k42, k41];
            
            case "L":
                    var k12 = Math.max(15 * Math.abs(rmass) - 3,-2);
            return [k12];
            
            case "G":
                    var k12 = 5 * Math.pow(rmass,2) - 5;
            return [k12];
            default:
            return [undefined]
        }
    }

    junctionalphak = (element,junction) => {
        var junction_type = junction.type
        var psup = junction.psup
        var pinf = junction.pinf
        //var padc = junction.padc
        var kij = junction.kij
        var v=0;
        var u=0;
        switch (junction_type){
            case "T":
            //piso
                v+=Math.sqrt(psup.fc/fref)*Math.pow(10,-kij[0]/10);  	        //k21
                v+=Math.sqrt(pinf.fc/fref)*Math.pow(10,-kij[2]/10);		        //k23
            //parede
                u+=Math.sqrt(element.fc/fref)*Math.pow(10,-kij[0]/10);		    //k12
                u+=Math.sqrt(psup.fc/fref)*Math.pow(10,-kij[1]/10);		        //k13
            return [v,u];

            case "T2":
            //piso
                v+=Math.sqrt(psup.fc/fref)*Math.pow(10,-kij[0]/10);  	        //k21
                v+=Math.sqrt(pinf.fc/fref)*Math.pow(10,-kij[2]/10);		        //k23
            //parede
                u+=Math.sqrt(psup.fc/fref)*Math.pow(10,-kij[0]/10);		    //k12
                u+=Math.sqrt(element.fc/fref)*Math.pow(10,-kij[1]/10);		        //k13
            return [v,u];
            
            case "X":
            //piso
                v+=Math.sqrt(pinf.fc/fref)*Math.pow(10,-kij[0]/10);		        //k12 [m1,m2,m3,m4]
                v+=Math.sqrt(element.fc/fref)*Math.pow(10,-kij[1]/10);		    //k13
                v+=Math.sqrt(psup.fc/fref)*Math.pow(10,-kij[0]/10);		        //k14
                
            //parede
                u+=Math.sqrt(pinf.fc/fref)*Math.pow(10,-kij[2]/10);		        //k42
                u+=Math.sqrt(element.fc/fref)*Math.pow(10,-kij[3]/10);		    //k41
                u+=Math.sqrt(pinf.fc/fref)*Math.pow(10,-kij[3]/10);		        //k12
            return [v,u];
            
            default:
                v=Math.sqrt(psup.fc/fref)*Math.pow(10,-kij/10); //quando as paredes do L forem diferentes???
                u=Math.sqrt(element.fc/fref)*Math.pow(10,-kij/10);
            return [v,u];
        }
    }

    junctionlengthk = (element, junction, x) => {
        var psup = junction.psup
        if (x === 'n') { return psup.y }                                        // para junções das paredes (1,2,3,4)
        if (x === 'i') { return element.x === psup.x ? element.x : element.y }  // para junções com piso (a,b,c,d)

    }

    junctionaklk = (junction) => {return junction.alphak.map(ak => {return ak * junction.lengthk})}

    doCalcPartOne = () =>{
        var sides = ['a','b','c','d']
        var parts = ['psup','pinf','padc']
        var side_root = ''
        var side_x_part = ''
        var junction_x = ''
        var {floor} = this.state

        sides.map(e =>{
            side_root = 'side_' + e + '_'
            junction_x = 'junction_' + e
                parts.map(p => {
                    side_x_part = side_root + p

                        this.state[side_x_part].l1 = this.elementl1(this.state[side_x_part])
                        this.state[side_x_part].l2 = this.elementl2(this.state[side_x_part])
                        this.state[side_x_part].Si = this.elementSi(this.state[side_x_part])
                        this.state[side_x_part].smass = this.elementsmass(this.state[side_x_part])
                        this.state[side_x_part].fc = this.elementfc(this.state[side_x_part])
                        this.state[side_x_part].fc_eff = this.elementfc_eff(this.state[side_x_part])
                        this.state[side_x_part].f11 = this.elementf11(this.state[side_x_part])
                        this.state[side_x_part].sigma1 = this.elementsigma1(this.state[side_x_part])
                        this.state[side_x_part].sigma2 = this.elementsigma2(this.state[side_x_part])
                        this.state[side_x_part].sigma3 = this.elementsigma3(this.state[side_x_part])
                        this.state[side_x_part].sigma = this.elementsigma(this.state[side_x_part])
                        this.state[side_x_part].sigmaf = this.elementsigmaf(this.state[side_x_part])
                        this.state[side_x_part].Qui = this.elementQui(this.state[side_x_part])
                        this.state[side_x_part].Psi = this.elementPsi(this.state[side_x_part])
                        this.state[side_x_part].Alpha = this.elementAlpha(this.state[side_x_part])
                        this.state[side_x_part].AlphaK = this.elementAlphaK(this.state[side_x_part])
                        this.state[side_x_part].ntotlab = this.elementntotlab(this.state[side_x_part])
                        this.state[side_x_part].Tslab = this.elementTs(this.state[side_x_part].ntotlab)
                        this.state[side_x_part].Rlab = this.elementR(this.state[side_x_part],this.state[side_x_part].ntotlab)

                        this.state[junction_x][p] = this.state[side_x_part]                  

                })
        })
    }

    doCalcPartTwo = () =>{
        var sides = ['a','b','c','d']
        var parts = ['psup','pinf','padc']
        var side_root = ''
        var side_x_part = ''
        var junction_x = ''
        var {floor} = this.state

        sides.map(e =>{
            side_root = 'side_' + e + '_'
            junction_x = 'junction_' + e
                parts.map(p => {
                    side_x_part = side_root + p

                        this.state[junction_x].rmass = this.junctionrmass(floor,this.state[junction_x])
                        this.state[junction_x].PC = this.junctionPC(floor,this.state[junction_x])
                        this.state[junction_x].Y = this.junctionY(this.state[junction_x])
                        this.state[junction_x].kij = this.junctionkij(this.state[junction_x])
                        this.state[junction_x].kij_ = this.junctionkij_(floor,this.state[junction_x])
                        this.state[junction_x].alphak = this.junctionalphak(floor,this.state[junction_x])
                        this.state[junction_x].lengthk = this.junctionlengthk(floor,this.state[junction_x],'i')
                        this.state[junction_x].aklk = this.junctionaklk(this.state[junction_x])

                })
        })
    }

    doCalcPartOneHalfSup = () => {
        //pode adaptar para pinf e padc
        var sides = [1,2,3,4]
        var letter = ['a','b','c','d']
        var parts = ['psup']//,'pinf','padc']
        var side_root = ''
        //var side_x_part = ''
        var junction_x = ''

        sides.map((e,index)=>{
            junction_x = "junction_" + e
            var n = 0
            if (index < letter.length-1) {n = index+1} else {n = index-3}
            this.state[junction_x]['psup'] = this.state['side_' + letter[n] + "_psup"]
            this.state[junction_x]['pinf'] = this.state['side_' + letter[n] + "_psup"]
            this.state[junction_x]['padc'] = this.state['side_' + letter[index] + "_psup"]

        })

    }

    doCalcPartOneHalfInf = () => {
        //pode adaptar para pinf e padc
        var sides = [5,6,7,8]
        var letter = ['a','b','c','d']
        var parts = ['pinf']//,'pinf','padc']
        var side_root = ''
        //var side_x_part = ''
        var junction_x = ''

        sides.map((e,index)=>{
            junction_x = "junction_" + e
            var n = 0
            if (index < letter.length-1) {n = index+1} else {n = index-3}
            this.state[junction_x]['psup'] = this.state['side_' + letter[n] + "_pinf"]
            this.state[junction_x]['pinf'] = this.state['side_' + letter[n] + "_pinf"]
            this.state[junction_x]['padc'] = this.state['side_' + letter[index] + "_pinf"]

        })

    }

    doCalcPartTwoHalfSup = () => {
        //pode adaptar para pinf e padc
        var sides = [1,2,3,4]
        var letter = ['a','b','c','d']
        var parts = ['psup']//,'pinf','padc']
        var side_root = ''
        //var side_x_part = ''
        var junction_x = ''
        var {floor} = this.state
        var sidetxt = ''

        sides.map((e,index)=>{
            junction_x = "junction_" + e
            sidetxt = "side_" + letter[index] + "_psup"


            this.state[junction_x].rmass = this.junctionrmass(this.state[sidetxt],this.state[junction_x])
            this.state[junction_x].PC = this.junctionPC(this.state[sidetxt],this.state[junction_x])
            this.state[junction_x].Y = this.junctionY(this.state[junction_x])
            this.state[junction_x].kij = this.junctionkij(this.state[junction_x])
            this.state[junction_x].kij_ = this.junctionkij_(this.state[sidetxt],this.state[junction_x])
            this.state[junction_x].alphak = this.junctionalphak(this.state[sidetxt],this.state[junction_x])
            this.state[junction_x].lengthk = this.junctionlengthk(this.state[sidetxt],this.state[junction_x],'n')
            this.state[junction_x].aklk = this.junctionaklk(this.state[junction_x])

        })

    }

    doCalcPartTwoHalfInf = () => {
        //pode adaptar para pinf e padc
        var sides = [5,6,7,8]
        var letter = ['a','b','c','d']
        var parts = ['pinf']//,'pinf','padc']
        var side_root = ''
        //var side_x_part = ''
        var junction_x = ''
        var {floor} = this.state
        var sidetxt = ''

        sides.map((e,index)=>{
            junction_x = "junction_" + e
            sidetxt = "side_" + letter[index] + "_pinf"


            this.state[junction_x].rmass = this.junctionrmass(this.state[sidetxt],this.state[junction_x])
            this.state[junction_x].PC = this.junctionPC(this.state[sidetxt],this.state[junction_x])
            this.state[junction_x].Y = this.junctionY(this.state[junction_x])
            this.state[junction_x].kij = this.junctionkij(this.state[junction_x])
            this.state[junction_x].kij_ = this.junctionkij_(this.state[sidetxt],this.state[junction_x])
            this.state[junction_x].alphak = this.junctionalphak(this.state[sidetxt],this.state[junction_x])
            this.state[junction_x].lengthk = this.junctionlengthk(this.state[sidetxt],this.state[junction_x],'n')
            this.state[junction_x].aklk = this.junctionaklk(this.state[junction_x])

        })

    }

    doCalcPartThree = () => {
        var sides = ['a','b','c','d']
        var parts = ['psup','pinf']//,'padc']
        var side_root = ''
        var side_x_part = ''
        var junction_x = ''
        var {floor} = this.state

        sides.map(e =>{
            side_root = 'side_' + e + '_'
            junction_x = 'junction_' + e
                parts.map(p => {
                    side_x_part = side_root + p

                    this.state[side_x_part].Eaklk = this.elementEaklk(e + "_" + p)
                    this.state[side_x_part].ntotsitu = this.elementntotsitu(this.state[side_x_part])
                    this.state[side_x_part].Tssitu = this.elementTs(this.state[side_x_part].ntotsitu)
                    this.state[side_x_part].Rsitu = this.elementRsitu(this.state[side_x_part])
                    this.state[side_x_part].Aisitu = this.elementAi(this.state[side_x_part],this.state[side_x_part].Tssitu)                 

                })
        })
    }

    doCalcPartFour = () =>{
        var sides = ['a','b','c','d']
        var flank_x = ''
        var junction_x = ''
        var {floor} = this.state

        sides.map(side => {
            flank_x = 'flank_' + side
            junction_x = 'junction_' + side
                
                    this.state[flank_x].type = this.state[junction_x].type
                    this.state[flank_x].kij = this.state[junction_x].kij
                    this.state[flank_x].kij_ = this.state[junction_x].kij_
                    this.state[flank_x].lij = this.state[junction_x].lengthk
                    this.state[flank_x].Afloor = floor.Aisitu
                    this.state[flank_x].Apsup = this.state[junction_x]['psup']['Aisitu']
                    this.state[flank_x].Apinf = this.state[junction_x]['pinf']['Aisitu']

                    this.state[flank_x].Lnsitu = floor.Lnsitu
                    //this.state[flank_x].Ls = floor.Ls
                    this.state[flank_x].Rfloor = floor.Rsitu
                    //this.state[flank_x].Ri = floor.Rs
                    this.state[flank_x].Rpsup = this.state[junction_x]['psup']['Rsitu']
                    this.state[flank_x].Rpinf = this.state[junction_x]['pinf']['Rsitu']
                    this.state[flank_x].Sfloor = floor.Si
                    this.state[flank_x].Spsup = this.state[junction_x]['psup']['Si']
                    this.state[flank_x].Spinf = this.state[junction_x]['pinf']['Si']
                    this.state[flank_x].dLsitu = this.state.float.d

            
        })
    }

    flankDvsitu = (flank) => {
        var kij = flank.kij
        var kij_ = flank.kij_
        var lij = flank.lij
        var Afloor = flank.Afloor
        var Apsup = flank.Apsup
        var Apinf = flank.Apinf
        var Ai = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
        var Aj = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
        var kijfreq = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]

        return freq.map((freq,index) => {
            
            return kij.map((kij,idx) => {
            switch (idx) {
                case 0:
                    if (flank.type === "T") {
                        Ai = Apsup
                        Aj = Afloor
                    }
                    if (flank.type === "X") {
                        Ai = Afloor
                        Aj = Apinf
                    }           
                break;

                case 1:
                    if (flank.type === "T") {
                        Ai = Apsup
                        Aj = Apinf
                    }
                    if (flank.type === "X") {
                        Ai = Afloor
                        Aj = Afloor // Apadc mas n usa esse aqui então tá de boas
                    }
                break;

                case 2:
                    if (flank.type === "T") {
                        Ai = Afloor
                        Aj = Apinf
                    }
                    if (flank.type === "X") {
                        Ai = Apsup
                        Aj = Apinf
                    }
                break;

                case 3:
                    if (flank.type === "X") {
                        Ai = Apsup
                        Aj = Afloor
                    }
                break;
            
                default:
                    Ai = Afloor
                    Aj = Apinf
                 break;
            }

            switch(flank.type) {
                case "T":
                    if (freq < 200) {
                        kijfreq[index] = kij_[idx][0]
                    } else if (freq > 1000) {
                        kijfreq[index] = kij_[idx][2]
                    } else {
                        kijfreq[index] = kij_[idx][1]
                    }
                break;

                case "X":
                    if (freq < 200) {
                        kijfreq[index] = kij_[idx][0]
                    } else if (freq > 1000) {
                        kijfreq[index] = kij_[idx][2]
                    } else {
                        kijfreq[index] = kij_[idx][1]
                    }
                break;

                case "L":
                    if (freq < 200) {
                        kijfreq[index] = kij_[idx][0]
                    } else {
                        kijfreq[index] = kij_[idx][1]
                    }
                break;
            };

            if (kijsim == 0){
               // switch(flank.type) {
               //     case "T":
                        
                            kijfreq[index] = kij_[idx][0]
                        
              //      break;
    
            //        case "X":
            //            if (freq < 200) {
            //                kijfreq[index] = kij_[idx][0]
            //            } else if (freq > 1000) {
            //                kijfreq[index] = kij_[idx][2]
            //            } else {
            //                kijfreq[index] = kij_[idx][1]
            //            }
            //        break;
    //
            //        case "L":
            //            if (freq < 200) {
            //                kijfreq[index] = kij_[idx][0]
            //            } else {
            //                kijfreq[index] = kij_[idx][1]
            //            }
            //        break;
            //    }; 
            }

            return Math.max(0,kijfreq[index]-10*log10(lij/Math.sqrt(Ai[index]*Aj[index])))       // EQ 7
        })}) 
    }

    flankLnd = (flank) => {
        var Lnsitu = flank.Lnsitu  //
        var dLsitu = flank.dLsitu  // float
        var dLdsitu = [0] // camada adicional ΔLd,situ configurar no futuro

        return Lnsitu.map((Lnsitu,index) => {
            return Lnsitu - dLsitu[index] - dLdsitu[0] // EQ 11 (PARTE 2)
        })

    }

    flankRd = (flank) => {
        var Rsitu = flank.Rsitu
        var dRsitu = flank.dLsitu // esse aqui é recomendação da norma em usar a camada do piso flutuante. a norma diz q é grosseira
        var dRdsitu = [0] // camada adicional ΔRd,situ configurar no futuro

        return Rsitu.map((Rsitu,index) => {
            return Rsitu + dRsitu[index] + dRdsitu[0] // EQ 14 (PARTE 1)
        })
    }

    flankLnij = (flank) => {
        var Lnsitu = flank.Lnsitu   //
        var dLsitu = flank.dLsitu   //
        var Ri = flank.Rfloor          //
        var Rj = flank.Rpinf           //
        var Si = flank.Sfloor          //
        var Sj = flank.Spinf           //
        var Dvsitu = flank.Dvsitu   // 
        var dRjsitu = [0]            // ΔRj,situ

        return Dvsitu.map((Dv,index) => {
            return Dv.map((Dij,idx) => {
                return Lnsitu[index] - dLsitu[index] + ((Ri[index]-Rj[index])/2) - dRjsitu[0] - Dij - (10*log10(Math.sqrt(Si/Sj))) //EQ 12 (PARTE 2)
            })
        })

    }
 
    flankRij = (flank) => {
        var Rfloor = flank.Rfloor
        var Rpsup = flank.Rpsup
        var Rpinf = flank.Rpinf
        var Sfloor = flank.Sfloor
        var Spsup = flank.Spsup
        var Spinf = flank.Spinf
        var Ss = flank.Sfloor       // 10 para diagonal criar condicional, mas antes entender o q é né camarada
        var Ri = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]          //
        var Rj = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]          //
        var Si = 0           //
        var Sj = 0           //
        var Dvsitu = flank.Dvsitu   // 
        var dRjsitu = [0]            // ΔRi,situ            
        var dRisitu = ''

        return Dvsitu.map((Dv,index) => {
            return Dv.map((Dij,idx) => {
                                            
                switch (idx) {
                    case 0: // da pra aprimorar com psup, pinf e padc
                        if (flank.type === "T") { //ij=12
                            dRisitu = 0
                            Ri = Rpsup
                            Rj = Rfloor
                            Si = Spsup
                            Sj = Sfloor
                        } else
                        if (flank.type === "X") { //ij=12
                            dRisitu = 0
                            Ri = Rfloor
                            Rj = Rpinf
                            Si = Sfloor
                            Sj = Spinf
                        } else {dRisitu = 10000000000}
                        break;

                    case 1:
                        if (flank.type === "T") { //ij=13
                            dRisitu = 0
                            Ri = Rpsup
                            Rj = Rpinf
                            Si = Spsup
                            Sj = Spinf
                        } else
                        if (flank.type === "X") { //ij=13
                            dRisitu = 0// flank.dLsitu[index]
                            Ri = Rfloor
                            Rj = Rfloor
                            Si = Sfloor
                            Sj = Sfloor /// no J na vdd é padc mas n usa esse aqui (por enquanto...)
                        } else {dRisitu = 10000000000}
                        break;

                    case 2:
                        if (flank.type === "T") { //ij=23
                            dRisitu = 0 // flank.dLsitu[index]
                            Ri = Rfloor
                            Rj = Rpinf
                            Si = Sfloor
                            Sj = Spinf
                        } else
                        if (flank.type === "X") { //ij=42
                            dRisitu = 0
                            Ri = Rpsup
                            Rj = Rpinf
                            Si = Spsup
                            Sj = Spinf
                        } else {dRisitu = 10000000000}
                        break;

                    case 3:
                        if (flank.type === "X") { //ij=41
                            dRisitu = 0 //flank.dLsitu[index]
                            Ri = Rpsup
                            Rj = Rfloor
                            Si = Spsup
                            Sj = Sfloor
                        } else {dRisitu = 10000000000}
                        break;
                
                    default:
                        break;
                }

                return (Ri[index]/2) + (Rj[index]/2) + dRisitu + dRjsitu[0] + Dij + (10*log10(Ss/Math.sqrt(Si*Sj))) //EQ 15 (PARTE 1)
            })
        })

    }

    predictionL = () => {
        var fe = this.state.flank_floor_floor.Lnd
        var fa = this.state.flank_a.Lnijsitu.map((flank) => {return flank.filter((ff,i) => {if (this.state.flank_a.type === "T") {return i === 2} else {return i === 0}})})
        var fb = this.state.flank_b.Lnijsitu.map((flank) => {return flank.filter((ff,i) => {if (this.state.flank_b.type === "T") {return i === 2} else {return i === 0}})})
        var fc = this.state.flank_c.Lnijsitu.map((flank) => {return flank.filter((ff,i) => {if (this.state.flank_c.type === "T") {return i === 2} else {return i === 0}})})
        var fd = this.state.flank_d.Lnijsitu.map((flank) => {return flank.filter((ff,i) => {if (this.state.flank_d.type === "T") {return i === 2} else {return i === 0}})})
        var tau = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]

        fe.map((nn,index) => {
            tau[index] += Math.pow(10,nn/10)
        }) 

        fa.map((nn,index) => {
            tau[index] += Math.pow(10,nn/10)
        })

        fb.map((nn,index) => {
            tau[index] += Math.pow(10,nn/10)
        })

        fc.map((nn,index) => {
            tau[index] += Math.pow(10,nn/10)
        })

        fd.map((nn,index) => {
            tau[index] += Math.pow(10,nn/10)
        })

        if (this.state.flank_a.kij[0] === undefined) {tau = [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]}
        if (this.state.flank_b.kij[0] === undefined) {tau = [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]}
        if (this.state.flank_c.kij[0] === undefined) {tau = [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]}
        if (this.state.flank_d.kij[0] === undefined) {tau = [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]}

        return tau.map((nn,index) =>{
            return 10*log10(nn)
        })
    }

    predictionLnt = (L) => {
        return L.map((L,index) => {return L - 10*log10(0.032*this.props.x*this.props.y*this.props.z2)}) // Eq 3 (pt 2)
    }

    predictionR = () => {
        var fe = this.state.flank_floor_floor.Rdsitu
        //// ADICIONAR CONDICIONAL PARA X, T E L
        var fa = this.state.flank_a.Rijsitu.map((flank) => {return flank.filter ((ff,i) => {if (this.state.flank_a.type === "X") {return i !== 1} else {return ff}})})
        var fb = this.state.flank_b.Rijsitu.map((flank) => {return flank.filter ((ff,i) => {if (this.state.flank_b.type === "X") {return i !== 1} else {return ff}})})
        var fc = this.state.flank_c.Rijsitu.map((flank) => {return flank.filter ((ff,i) => {if (this.state.flank_c.type === "X") {return i !== 1} else {return ff}})})
        var fd = this.state.flank_d.Rijsitu.map((flank) => {return flank.filter ((ff,i) => {if (this.state.flank_d.type === "X") {return i !== 1} else {return ff}})})
        var tau = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]

        fe.map((nn,index) => {
            tau[index] += Math.pow(10,-nn/10)
        }) 

        fa.map((nn,index) => {
            
            nn.map(ij => {
                tau[index] += Math.pow(10,-ij/10)
            })
        })

        fb.map((nn,index) => {
            
            nn.map(ij => {
                tau[index] += Math.pow(10,-ij/10)
            })
        })

        fc.map((nn,index) => {
            
            nn.map(ij => {
                tau[index] += Math.pow(10,-ij/10)   
            })
        })

        fd.map((nn,index) => {
            
            nn.map(ij => {
                tau[index] += Math.pow(10,-ij/10)
            })
        })

        //if (this.state.flank_floor_floor.kij === undefined) {tau = [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]}
        if (this.state.flank_a.kij[0] === undefined) {tau = [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]}
        if (this.state.flank_b.kij[0] === undefined) {tau = [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]}
        if (this.state.flank_c.kij[0] === undefined) {tau = [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]}
        if (this.state.flank_d.kij[0] === undefined) {tau = [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]}
        
        return tau.map((nn,index) =>{
            return -10*log10(nn)
        })


    }

    predictionDnT = (R) => {
        return R.map((R,index) => {return R + 10*log10((0.32*this.props.x*this.props.y*this.props.z2)/(this.props.x*this.props.y))}) // Eq 3 (pt 2)
    }

    render(){

        const {            

            prediction,

            floor, float,
            side_a_psup, side_a_pinf, side_a_padc,
            side_b_psup, side_b_pinf, side_b_padc,
            side_c_psup, side_c_pinf, side_c_padc,
            side_d_psup, side_d_pinf, side_d_padc,

            junction_a, junction_b, junction_c, junction_d,
            junction_1, junction_2, junction_3, junction_4,
            junction_5, junction_6, junction_7, junction_8,

            flank_a, flank_b, flank_c, flank_d, flank_floor_floor, flank_00,
        
        } = this.state

        floor.l1 = this.elementl1(floor)
        floor.l2 = this.elementl2(floor)
        floor.Si = this.elementSi(floor)
        floor.smass = this.elementsmass(floor)
        floor.fc = this.elementfc(floor)
        floor.fc_eff = this.elementfc_eff(floor)
        floor.f11 = this.elementf11(floor)
        floor.sigma1 = this.elementsigma1(floor)
        floor.sigma2 = this.elementsigma2(floor)
        floor.sigma3 = this.elementsigma3(floor)
        floor.sigma = this.elementsigma(floor) 
        floor.sigmaf = this.elementsigmaf(floor)
        floor.Qui = this.elementQui(floor)
        floor.Psi = this.elementPsi(floor)
        floor.Alpha = this.elementAlpha(floor)
        floor.AlphaK = this.elementAlphaK(floor)
        floor.ntotlab = this.elementntotlab(floor)
        floor.Tslab = this.elementTs(floor.ntotlab)
        floor.Rlab = this.elementR(floor,floor.ntotlab)
        floor.Llab = this.elementLn(floor,floor.Tslab)

        float.smass = this.elementsmass(float.mass)
        float.f0 = this.floatf0(float)
        float.d = this.floatd(float)

        this.doCalcPartOne()        //--------------
        this.doCalcPartOneHalfSup() // coleta dados da junção
        this.doCalcPartOneHalfInf() //--------------
        this.doCalcPartTwo()        //________________
        this.doCalcPartTwoHalfSup() // calcula dados da junção
        this.doCalcPartTwoHalfInf() //________________

        ////////////////////////

        floor.Eaklk = this.elementEaklk('e')
        floor.ntotsitu = this.elementntotsitu(floor)
        floor.Tssitu = this.elementTs(floor.ntotsitu)
        floor.Rsitu = this.elementRsitu(floor) //MARCO
        floor.Lnsitu = this.elementLnsitu(floor) //MARCO
        floor.Aisitu = this.elementAi(floor,floor.Tssitu)
        //floor.Rs = this.elementRs(floor)
        //floor.Ls = this.elementLs(floor)

        //// calc three com todos os sides e p's

        this.doCalcPartThree() /// 

        this.doCalcPartFour() //// 

        flank_floor_floor.Lnsitu = this.state.floor.Lnsitu
        flank_floor_floor.Rsitu = this.state.floor.Rsitu
        flank_floor_floor.dLsitu = this.state.float.d
        flank_floor_floor.Lnd = this.flankLnd(flank_floor_floor)
        flank_floor_floor.Rdsitu = this.flankRd(flank_floor_floor) //Rdsitu

        flank_00.Lnsitu = this.state.floor.Llab
        flank_00.Rsitu = this.state.floor.Rlab
        flank_00.dLsitu = this.state.float.d
        flank_00.Ln = this.flankLnd(flank_00)
        flank_00.R = this.flankRd(flank_00)
        //console.log(flank_00.R)

        flank_a.Dvsitu = this.flankDvsitu(flank_a)
        flank_a.Lnijsitu = this.flankLnij(flank_a)
        flank_a.Rijsitu = this.flankRij(flank_a)

        flank_b.Dvsitu = this.flankDvsitu(flank_b)
        flank_b.Lnijsitu = this.flankLnij(flank_b)
        flank_b.Rijsitu = this.flankRij(flank_b)

        flank_c.Dvsitu = this.flankDvsitu(flank_c)
        flank_c.Lnijsitu = this.flankLnij(flank_c)
        flank_c.Rijsitu = this.flankRij(flank_c)

        flank_d.Dvsitu = this.flankDvsitu(flank_d)
        flank_d.Lnijsitu = this.flankLnij(flank_d)
        flank_d.Rijsitu = this.flankRij(flank_d)

        this.verifyStats()

        prediction.R_ = this.predictionR()  
        prediction.L = this.predictionL()
        prediction.DnT = this.predictionDnT(prediction.R_)
        prediction.R_w = tabajara(prediction.R_,"R'w")
        prediction.DnTw = tabajara(prediction.DnT,"DnT,w")
        prediction.LnT = this.predictionLnt(prediction.L)
        prediction.Lnw = tabajara(prediction.L,"L'n,w")
        prediction.LnTw = tabajara(prediction.LnT,"LnT,w")
        //floor.Llabw = tabajara(flank_00.Ln,"Ln,w")
        //floor.Rlabw = tabajara(flank_00.R,"Rw")
        //prediction.Rw = tabajara(prediction.R,"Rw")
        //prediction.DnTw = tabajara(prediction.DnT,"DnTw")

        return (
            <div>
                
                <h3 class="h3_transm">ESTIMATIVA DE TRANSMISSÃO</h3>
<table align="center"> 
            <tr>
                <td>
                    <div class="div_results">
                        <span class="spam_results_header"> D<sub>nT,w</sub> (C; C<sub>tr</sub>): </span> <br></br>
                        <span class="span_results"> {prediction.DnTw[0].toFixed(1)} ({prediction.DnTw[1]}; {prediction.DnTw[2]}) dB </span>
                    </div>
                    <div class="div_results">
                        <span class="spam_results_header"> L'<sub>nT,w</sub> (C<sub>I</sub>; C<sub>I,50-2500</sub>): </span> <br></br>
                        <span class="span_results"> {prediction.LnTw[0].toFixed(1)} ({prediction.LnTw[1]}; {prediction.LnTw[2]}) dB </span>
                    </div>
                </td>
            </tr>
</table>
                <h3 class="h3_transm">Ruído de impacto</h3>

                <div class="div_results_table_content">
                    <table class="result_table_flank">
                        <thead class="result_thead">
                            <tr>
                                <th rowSpan="2">F</th>
                                <th class="result_thead_small">Piso  </th>
                                <th class="result_thead_small">Flanco A</th>
                                <th class="result_thead_small">Flanco B</th>
                                <th class="result_thead_small">Flanco C</th>
                                <th class="result_thead_small">Flanco D</th>
                                <th rowSpan="2">L'<sub>n</sub></th>
                                <th rowSpan="2">L'<sub>nT</sub></th>
                            </tr>
                            <tr>
                                <th>L'<sub>n,Pp</sub></th>
                                <th>L'<sub>n,Pa</sub></th>
                                <th>L'<sub>n,Pb</sub></th>
                                <th>L'<sub>n,Pc</sub></th>
                                <th>L'<sub>n,Pd</sub></th>
                            </tr>
                            <tr>
                                <th class="result_thead_small">(Hz)</th>
                                <th class="result_thead_small">(dB)</th>
                                <th class="result_thead_small">(dB)</th>
                                <th class="result_thead_small">(dB)</th>
                                <th class="result_thead_small">(dB)</th>
                                <th class="result_thead_small">(dB)</th>
                                <th class="result_thead_small">(dB)</th>
                                <th class="result_thead_small">(dB)</th>
                            </tr>
                        </thead>
                            <FlankValueListL
                                prediction = {this.state.prediction}
                                flank_floor_floor={this.state.flank_floor_floor}
                                flank_a={this.state.flank_a}
                                flank_b={this.state.flank_b}
                                flank_c={this.state.flank_c}
                                flank_d={this.state.flank_d}
                            />
                    </table>
                    </div>
<br></br>
                    <h3 class="h3_transm">Ruído aéreo</h3>
                    <div class="div_results_table_content">
                    <table class="result_table_flank">
                        <thead class="result_thead">
                            <tr>
                                <th rowSpan="2">F</th>
                                <th class="result_thead_small" colSpan='5'>Piso  </th>
                                <th class="result_thead_small" colSpan='2'>Flanco A</th>
                                <th class="result_thead_small" colSpan='2'>Flanco B</th>
                                <th class="result_thead_small" colSpan='2'>Flanco C</th>
                                <th class="result_thead_small" colSpan='2'>Flanco D</th>
                                <th rowSpan="2">R'</th>
                                <th rowSpan="2">D<sub>nT</sub></th>
                            </tr>
                            <tr>
                                <th>R'<sub>Pp</sub></th>
                                <th>R'<sub>Ap</sub></th>
                                <th>R'<sub>Bp</sub></th>
                                <th>R'<sub>Cp</sub></th>
                                <th>R'<sub>Dp</sub></th>

                                <th>R'<sub>Pa</sub></th>
                                <th>R'<sub>Aa</sub></th>

                                <th>R'<sub>Pb</sub></th>
                                <th>R'<sub>Bb</sub></th>

                                <th>R'<sub>Pc</sub></th>
                                <th>R'<sub>Cc</sub></th>

                                <th>R'<sub>Pd</sub></th>
                                <th>R'<sub>Dd</sub></th>
                            </tr>
                            <tr>
                                <th class="result_thead_small">(Hz)</th>
                                <th class="result_thead_small">(dB)</th>
                                <th class="result_thead_small">(dB)</th>
                                <th class="result_thead_small">(dB)</th>
                                <th class="result_thead_small">(dB)</th>
                                <th class="result_thead_small">(dB)</th>

                                <th class="result_thead_small">(dB)</th>
                                <th class="result_thead_small">(dB)</th>

                                <th class="result_thead_small">(dB)</th>
                                <th class="result_thead_small">(dB)</th>

                                <th class="result_thead_small">(dB)</th>
                                <th class="result_thead_small">(dB)</th>

                                <th class="result_thead_small">(dB)</th>
                                <th class="result_thead_small">(dB)</th>

                                <th class="result_thead_small">(dB)</th>
                                <th class="result_thead_small">(dB)</th>
                            </tr>
                        </thead>
                            <FlankValueListD
                                prediction = {this.state.prediction}
                                flank_floor_floor={this.state.flank_floor_floor}
                                flank_a={this.state.flank_a}
                                flank_b={this.state.flank_b}
                                flank_c={this.state.flank_c}
                                flank_d={this.state.flank_d}
                            />
                    </table>
                    
                </div>

            </div>
        )
    }

}

class FlankValueListL extends Component{

    constructor(props){
        super(props);
        this.state ={
            prediction: this.props.prediction,
            flank_floor_floor: this.props.flank_floor_floor,
            flank_a: this.props.flank_a,
            flank_b: this.props.flank_b,
            flank_c: this.props.flank_c,
            flank_d: this.props.flank_d,
        }
      }

    render (){

        const {prediction,flank_a,flank_b,flank_c,flank_d,flank_floor_floor} = this.props

        
        const rows = freq.map((row, index) => {
            return (
              <tr key={index} name={index}>
                <td class="table_row result_row">{row}</td>
                <td class="table_row result_row">{flank_floor_floor.Lnd[index].toFixed(1) !== 'NaN' ? flank_floor_floor.Lnd[index].toFixed(1) : "-"}</td>
                <td class="table_row result_row">{flank_a.type == "T" ? flank_a.Lnijsitu[index][2].toFixed(1) : flank_a.type == "X" ? flank_a.Lnijsitu[index][0].toFixed(1) : "-"}</td>
                <td class="table_row result_row">{flank_b.type == "T" ? flank_b.Lnijsitu[index][2].toFixed(1) : flank_b.type == "X" ? flank_b.Lnijsitu[index][0].toFixed(1) : "-"}</td>
                <td class="table_row result_row">{flank_c.type == "T" ? flank_c.Lnijsitu[index][2].toFixed(1) : flank_c.type == "X" ? flank_c.Lnijsitu[index][0].toFixed(1) : "-"}</td>
                <td class="table_row result_row">{flank_d.type == "T" ? flank_d.Lnijsitu[index][2].toFixed(1) : flank_d.type == "X" ? flank_d.Lnijsitu[index][0].toFixed(1) : "-"}</td>
                <td class="table_row result_row">{prediction.L[index].toFixed(1)}</td>
                <td class="table_row result_row">{prediction.LnT[index].toFixed(1) !== "Infinity" ? prediction.LnT[index].toFixed(1) : "-"}</td>
              </tr>
            )
          })
        return(<tbody>{rows}</tbody>)
        

    }
}

class FlankValueListD extends Component{

    constructor(props){
        super(props);
        this.state ={
            prediction: this.props.prediction,
            flank_floor_floor: this.props.flank_floor_floor,
            flank_a: this.props.flank_a,
            flank_b: this.props.flank_b,
            flank_c: this.props.flank_c,
            flank_d: this.props.flank_d,
        }
      }

    render (){

        const {prediction,flank_a,flank_b,flank_c,flank_d,flank_floor_floor} = this.props

        
        const rows = freq.map((row, index) => {
            return (
              <tr key={index} name={index}>
                <td class="table_row result_row_d">{row}</td>
                <td class="table_row result_row_d">{flank_floor_floor.Rdsitu[index].toFixed(1) !== "NaN" ? flank_floor_floor.Rdsitu[index].toFixed(1) : "-"}</td>
                <td class="table_row result_row_d">{flank_a.type == "T" ? flank_a.Rijsitu[index][0].toFixed(1) : flank_a.type == "X" ? flank_a.Rijsitu[index][2].toFixed(1) : "-"}</td>
                <td class="table_row result_row_d">{flank_b.type == "T" ? flank_b.Rijsitu[index][0].toFixed(1) : flank_b.type == "X" ? flank_b.Rijsitu[index][2].toFixed(1) : "-"}</td>
                <td class="table_row result_row_d">{flank_c.type == "T" ? flank_c.Rijsitu[index][0].toFixed(1) : flank_c.type == "X" ? flank_c.Rijsitu[index][2].toFixed(1) : "-"}</td>
                <td class="table_row result_row_d">{flank_d.type == "T" ? flank_d.Rijsitu[index][0].toFixed(1) : flank_d.type == "X" ? flank_d.Rijsitu[index][2].toFixed(1) : "-"}</td>

                <td class="table_row result_row_d">{flank_a.type == "T" ? flank_a.Rijsitu[index][2].toFixed(1) : flank_a.type == "X" ? flank_a.Rijsitu[index][3].toFixed(1) : "-"}</td>
                <td class="table_row result_row_d">{flank_a.type == "T" ? flank_a.Rijsitu[index][1].toFixed(1) : flank_a.type == "X" ? flank_a.Rijsitu[index][0].toFixed(1) : "-"}</td>

                <td class="table_row result_row_d">{flank_b.type == "T" ? flank_b.Rijsitu[index][2].toFixed(1) : flank_b.type == "X" ? flank_b.Rijsitu[index][3].toFixed(1) : "-"}</td>
                <td class="table_row result_row_d">{flank_b.type == "T" ? flank_b.Rijsitu[index][1].toFixed(1) : flank_b.type == "X" ? flank_b.Rijsitu[index][0].toFixed(1) : "-"}</td>

                <td class="table_row result_row_d">{flank_c.type == "T" ? flank_c.Rijsitu[index][2].toFixed(1) : flank_c.type == "X" ? flank_c.Rijsitu[index][3].toFixed(1) : "-"}</td>
                <td class="table_row result_row_d">{flank_c.type == "T" ? flank_c.Rijsitu[index][1].toFixed(1) : flank_c.type == "X" ? flank_c.Rijsitu[index][0].toFixed(1) : "-"}</td>

                <td class="table_row result_row_d">{flank_d.type == "T" ? flank_d.Rijsitu[index][2].toFixed(1) : flank_d.type == "X" ? flank_d.Rijsitu[index][3].toFixed(1) : "-"}</td>
                <td class="table_row result_row_d">{flank_d.type == "T" ? flank_d.Rijsitu[index][1].toFixed(1) : flank_d.type == "X" ? flank_d.Rijsitu[index][0].toFixed(1) : "-"}</td>

                <td class="table_row result_row_d">{prediction.R_[index].toFixed(1)}</td>
                <td class="table_row result_row_d">{prediction.DnT[index].toFixed(1) !== "NaN" ? prediction.DnT[index].toFixed(1) : "-"}</td>
              </tr>
            )
          })
        return(<tbody>{rows}</tbody>)
        

    }
}

export default BosmangCore;