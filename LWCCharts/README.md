# ChartJS on LWC
LWC for drawing ChartJS charts from a query data

## Build

<a href="https://githubsfdeploy.herokuapp.com?owner=DanielUtrera&repo=LWCcharts&ref=master">
  <img alt="Deploy to Salesforce"
       src="https://raw.githubusercontent.com/afawcett/githubsfdeploy/master/deploy.png">
</a>

## Test

##<lightning-layout-item  size='6' padding="around-small">
##        <c-grafica-chart-j-s 
##        titulo-grafica="Titulo" 
##        tipo-grafica="doughnut" 
##        query-fields="Account.Name label,count(id) value"
##        query-object="Case"
##        query-grouping="Account.Name"
##        query-where="Origin ='Web'"></c-grafica-chart-j-s >

## Resources
<a href="https://developer.salesforce.com/docs/component-library/documentation/lwc">
LWC Guide
</a><br>
<a href="https://www.chartjs.org/">
ChartJS
</a>
## Description of Files and Directories

## Issues
