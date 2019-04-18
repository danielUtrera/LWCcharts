/* eslint-disable vars-on-top */

import { LightningElement,track,api,wire } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { loadScript, loadStyle } from 'lightning/platformResourceLoader';
import chartJS from '@salesforce/resourceUrl/chartJS';
import dashboardQuery from '@salesforce/apex/DisputaPaypalController.dashboardQuery';

export default class graficaChartJS extends LightningElement {
    @api tituloGrafica='Titulo';
    @api tipoGrafica;

    @api 
    get labelsGrafica(){
        return this._labelsGrafica; 
    }
    set labelsGrafica(value) {
        console.log('labelsGrafica');
        console.log(value);
        console.log(value.split(','));
        this._labelsGrafica = value.split(',');
    }
    @api 
    get colorsGrafica(){
        return this._colorsGrafica; 
    }
    set colorsGrafica(value) {
        console.log('colorsGrafica');
        console.log(value);
        console.log(value.split(','));
        this._colorsGrafica = value.split(',');
    }

    @api queryFields;
    @api queryObject;
    @api queryWhere;

    @api 
    get queryWhereFiltros(){
        return this._queryWhereFiltros;
    }
    set queryWhereFiltros(value) {
        this._queryWhereFiltros = value;
        console.log('actualizado filtro');
        this.updateQuery();
        this.loadChart();
    }

    queryWhereFiltrosPrev;
    @api queryGrouping;
    @api queryOrder;
    @api queryLimit;

    @track query;
    @track ctx; 
    @track queryResult;

    @track data;
    @track labels;
    @track colors;

    valuesDataset1;
    valuesDataset2;
    labelsLine;

    datasets;
    labels2;
    item;

    chartConfig='';

    myChart;
    ChartJSInitialized = false;
    config;
    loopIndex;

    updateQuery(){
        this.query='select '+this.queryFields;
        this.query+=' FROM '+this.queryObject;
        if(this.queryWhere){
            this.query+=' WHERE '+this.queryWhere;
            if(this.queryWhereFiltros){
                this.query+=this.queryWhereFiltros;
            }
        }else{
            this.query+=' WHERE Id!=null '+this.queryWhereFiltros;
        }
        if(this.queryGrouping){
            this.query+=' GROUP BY '+this.queryGrouping;
        }
        if(this.queryOrder){
            this.query+=' ORDER BY '+this.queryOrder; 
        }
        if(this.queryLimit){
            this.query+=' LIMIT '+this.queryLimit;
        }
        console.log(this.query);
    }

    renderedCallback() {
        this.updateQuery();
        if (this.ChartJSInitialized) {
            return;
        }
        this.ChartJSInitialized = true;

        Promise.all([
            loadScript(this, chartJS + '/Chart.js'),
            loadStyle(this, chartJS + '/Chart.css')
        ])
            .then(() => {
                this.loadChart(); 
            })
            .catch(error => {
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Error loading Chart JS',
                        message: error.message,
                        variant: 'error'
                    })
                );
            });
    }
    loadChart(){
        dashboardQuery({query:this.query,objectQueried:this.queryObject})
                .then(result => {
                    console.log('RESULT')
                    console.log(JSON.parse(result));
                    this.queryResult=JSON.parse(result);
                    this.data=[];
                    this.labels=[];
                    this.colors=[];
                    this.datasets=[];
                    if(this.tipoGrafica==='doughnut'){
                        //console.log('DONUT');
                        for (this.loopIndex = 0; this.loopIndex < this.queryResult.length; this.loopIndex++) { 
                            //console.log(this.queryResult[this.loopIndex]);
                            if(this.queryResult[this.loopIndex].value){
                                this.data.push(this.queryResult[this.loopIndex].value);
                            }else{
                                this.data.push(0);
                            }
                            if(this.queryResult[this.loopIndex].label){
                                this.labels.push(this.queryResult[this.loopIndex].label);
                            }else{
                                this.labels.push('¿?');
                            }
                            if(this.queryResult[this.loopIndex].color){
                                this.colors.push(this.queryResult[this.loopIndex].color);
                            }else{
                                this.colors.push('#a8a8a8');
                            }
                        }
                        //console.log(this.labels);
                        //console.log(this.data);
                        this.config = {
                            type: this.tipoGrafica,
                            data: {
                                datasets: [
                                    {
                                        data:this.data,
                                        backgroundColor:this.colors,
                                        label: 'Dataset 1'
                                    }
                                ],
                                labels: this.labels
                            },
                            options: {
                                responsive: true,
                                legend: {
                                    position: 'top'
                                },
                                animation: {
                                    animateScale: true,
                                    animateRotate: true
                                }
                            }
                        };
                    }else if(this.tipoGrafica==='line'){
                        if(this.labelsGrafica){
                            for(this.loopIndex=0;this.loopIndex<this.labelsGrafica.length;this.loopIndex++){
                                if(this.colorsGrafica[this.loopIndex]){
                                    this.item=this.colorsGrafica[this.loopIndex];
                                }else{
                                    this.item='#a5a5a5';
                                }
                                var dataset={
                                    data:[0,0,0,0,0,0,0,0,0,0,0,0],
                                    fill: false,
                                    backgroundColor:this.item,
                                    borderColor:this.item,
                                    label:this.labelsGrafica[this.loopIndex]
                                }
                                this.datasets.push(dataset);
                            }
                        }
                        console.log('line');
                        for (this.loopIndex = 0; this.loopIndex < this.queryResult.length; this.loopIndex++){
                            var mes=parseInt(this.queryResult[this.loopIndex].month,10);
                            for (var item in this.queryResult[this.loopIndex]) {
                                if ({}.hasOwnProperty.call(this.queryResult[this.loopIndex], item)) {
                                    if(item.indexOf('value')>=0){
                                        console.log('ES UN VALOR');
                                        var val=0;
                                        if(this.queryResult[this.loopIndex][item]){
                                            console.log('Y NO ES NULO');
                                            val=this.queryResult[this.loopIndex][item];
                                        }
                                        var s=parseInt(item.split('alue')[1],10);
                                        console.log(s-1);
                                        console.log(mes);
                                        console.log(val);
                                        console.log(this.datasets);
                                        this.datasets[s-1].data[mes]=val;
                                    }
                                    

                                    console.log(item);
                                    console.log(this.queryResult[this.loopIndex][item]);
                                }
                            }
                        }
                        this.valuesDataset1=[0,3,0,2,9,6,3,3,2,5,0,10];
                        this.valuesDataset2=[0,0,5,1,9,3,3,3,4,6,0,9];
                        this.chartConfig='{type:this.tipoGrafica,data:{datasets:[{data:this.valuesDataset1,fill:false,backgroundColor:\'#1f5ec4\',borderColor:\'#1f5ec4\',label:\'Anterior\'},{data:this.valuesDataset2,fill:false,backgroundColor:\'#349616\',borderColor:\'#349616\',label:\'Actual\'}],labels:[\'Enero\',\'Febrero\',\'Marzo\',\'Abril\',\'Mayo\',\'Junio\',\'Julio\',\'Agosto\',\'Septiembre\',\'Octubre\',\'Noviembre\',\'Diciembre\']},options:{responsive:true,legend:{position:\'top\'},animation:{animateScale:true,animateRotate:true}}};}';
                        this.config = {
                            type: this.tipoGrafica,
                            data: {
                                datasets: this.datasets,
                                labels: ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre']
                            },
                            options: {
                                responsive: true,
                                legend: {
                                    position: 'top'
                                },
                                animation: {
                                    animateScale: true,
                                    animateRotate: true
                                }
                            }
                        };
                    }
                    
                    const ctx = this.template
                    .querySelector('canvas.donut')
                    .getContext('2d');
                    if(this.chart){
                        //console.log(typeof this.chart);
                        this.chart.destroy();
                    }
                    this.chart = new window.Chart(ctx, this.config);   
                })
                .catch(error => {
                    console.log(error);
                });
    }
}