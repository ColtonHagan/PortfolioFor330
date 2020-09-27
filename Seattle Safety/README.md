# INFO 201 BE6: Public Safety in Seattle
Group members: Cheng Gong, Yingrui Jia, Elizabeth Lin, and Colton Hagan

[Link to Shiny App: Public Safety in Seattle](https://coltonhagan55.shinyapps.io/info201_be6_2/)

### Background Information (Cheng)
The theme our group is going to explore is public safety in Seattle. Therefore, we downloaded two datasets that highly represent the certain situation in Seattle, `crime` and `firecall` datasets containing relevant information of date and time of reports, locations of the reports, types of the reports on the website `Seattle Open Data Portal`. This project focuses on people who are concerned about their safety in Seattle. By using R packages and shiny application, we made this report and gives people visualizations of frequency that reported crimes or fire calls differentiate in different neighborhoods or time periods in Seattle.

The blockquote on the right side is the distribution of our work.



### 1. Overview (Cheng)
The two plots are displaying the frequency of *crime* and *firecall* recorded during the year 2017 and 2018. The widget on the right side of the two plots allows users to choose the specific year they want to inspect. The default choice `summary` is designed to show a barplot comparing the total numbers of reports between 2017 and 2018.  The rest of the choices are left for users to pick a certain year and *further explore the distribution in each of 12 `months` in this year* (or to see the trajectory through the whole year).

If users have intentions to dig deeper into the `crime` and `firecall` datasets, the information and plots below would fulfill their expectation.



### 2. Crime Dataset Exploration
**2.1 Pie Chart (Elizabeth)**

This pie chart display the top 20 most common crime neighborhoods or the least 20 crime neighborhoods in Seattle. The widget helps to interact between both charts to view the common crime locations in Seattle. This chart is important for clients who want to be able to learn about the frequency of Crime in Seattle neighborhoods. This visualization provides a breakdown in terms of regions of Seattle that have the most reports collected by the City of Seattle. Our data is initially from the City of Seattle and this dataset is updated every 5 minutes to reflect the real-time trends in term of Crime reports in Seattle. 

From our visualization, I computed that:
 - DOWNTOWN COMMERCIAL has the most crimes of all Seattle Neighborhoods with a total of 13,715 reported crimes from 2017-2018.
 - COMMERCIAL HARBOR ISLAND has the least crimes of all Seattle Neighborhoods with a total of 64 reported crimes from 2017-2018.



**2.2 Barplot (Yingrui)**

This plot displays the frequency of crimes during certain time of a day. The x axis is the frequency and the y axis stands for four time periods. Specifically, morning indicates from 08:00 to 11:59. Afternoon indicates from 12:00 to 16:59. Night indicates from 17:00 to 23:59 and midnight suggests from 00:00 to 07:59. The widget controls the the type of crime being showed up on the plot. For example, we see that Theft and shoplifting happens the most frequently during the afternoon and the least frequently at midnight. From going over the plot for various kinds of crimes across all 30 types of them, we see that generally robbery related crimes happen more frequently during night and midnight and stealing related crimes often took place during the afternoon and early in the morning. 



### 3. 911 Dataset Exploration(Colton)
My contribution to the project was making a map of Seattle showing which areas had the highest chance of calling 911 over a fire.  For example, the one 'brightest spot' (Lightest color) is an industral complex which has a lot more fires then rural area. You can interact with the map in a couple days: You can just change the cosmetics by changing the color that the map displays in  (green, red, blue, grey, or 'fire colors' (red, yellow, orange)). You can also change what year is being displayed (either 2017 or 2018) like this so you can see if there are any changes on a year to year basis. 
