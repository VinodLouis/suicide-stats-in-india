# Suicide statistics of india

Technology used:

 * HTML/CSS
 * JavaScript(ES6)
 * D3
 * Bootstrap


For a Live Demo visit [link]().

Data Source : [data.gov.in](https://data.gov.in/catalog/stateut-wise-professional-profile-suicide-victim)


Description about viz: The viz is made of all suicide data between 2001 - 2013 intent is to show user the data in more meaningfull manner and let him explore ofr himself.

```
Aggregation view :

1. The viz initially lods with aggregation data of all State/UT spanning from 2001 to 2013.
2. You can hover on any section of the charts to get an overview of each state/year and click to see more insights.
3. The legends at the right hand side of aggregation data are also interactive which when clicked will change the chart to that specific year.
4. You can sort the filteretd year above, clicking legend again will restore the chart to its previous position.
```

Aggregation view :
![Aggregation view](https://raw.githubusercontent.com/VinodLouis/suicide-stats-in-india/master/screenshots/aggregate.png)

Aggregation Filter view
![Aggregation Filtered view](https://raw.githubusercontent.com/VinodLouis/suicide-stats-in-india/master/screenshots/filteragg.png)


```
Insights View :

1. When clicked on any of the section from Aggregation view, you will see an modal open to show insights data of selected state in selected year.
2. The insights data consists of four sections Map,two pie charts and one guage chart; Map takes a little time to load.
3. Pie charts show data view each for occupation/age wise suicide cases more details can been seen on hover with mouse, where as guage charts show male/female stats for the same.
4. The map loads data for all State/UT for the selected year, The larger the circle on map more is the suicide cases in those regions.
5. Map is interactive here, when clicked on any red dots in given region the associated charts get updated simultaneously.
```

Insights View :
![Insights view](https://raw.githubusercontent.com/VinodLouis/suicide-stats-in-india/master/screenshots/insights.png)


```
Deeper Insights View :

1. In the same modal window in tab you can see a deep insight view also. It changes with the context selection from map.
2. The deeper insights shows you an full details of the suicide cases from starting from aggregate total to drill down till specific gender/occupation/age group.
3. At any point you can close modal to get back to default viz of agrregate data.

```

Insights View :
![Insights view](https://raw.githubusercontent.com/VinodLouis/suicide-stats-in-india/master/screenshots/deepinsights.png)