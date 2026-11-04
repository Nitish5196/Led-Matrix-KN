---
title: "Led-Matrix-KN"
github: "https://github.com/Nitish5196/Led-Matrix-KN"
description: "  "
created_at: "2026-10-31"
total_time: "hrs"
---
## Oct 31 2026 <started working on it>
Ok so i wanted to make a matrix board project for half life week 4(ig) but every matrix board online in robu , amazon and robocraze was around $30 which is way over my budget so i though of giving up and choosing a oled display project but then i found a matrix board for under $20 from a sketchy ah website so i decided to work on my original idea .
### So the basic funcinallity of the project:
- Since it consumes a lot of power it wont be turned on all the time so instead of using a basic switch to turn it on im adding a sound detector to detect when i clap and turn the display on .
- i'll be using this to display and track my packages like for example lets say im receiving a Fedex order , i dont wanna open the website and enter my tracking number everytime to check for updates so im making a Package tracker to automatically fetch the details and display it on the Led Matrix board
- But....no one is gonna get packages all the time so what happens to the Display when you are not expecting any package? it will display a spiral spinning or your name or anything you enter on the website
-YES I'll be making a website to control what you display on the display
so wht i did today? worked on the schematic a bit and added the BOM to Readme
   
**Total time spent:2.5hrs**
## Nov 1 2026 <finished the schematic>
i finished the schematic in kicad  <img width="954" height="581" alt="image" src="https://github.com/user-attachments/assets/89f7c980-d633-4784-84b9-9d2032cff4ab" /><img width="479" height="423" alt="image" src="https://github.com/user-attachments/assets/53616fae-d0a7-4b34-a1b0-a4aba40432a4" /><img width="466" height="505" alt="image" src="https://github.com/user-attachments/assets/8228733f-cc31-42f8-aa44-260988d779c0" /><img width="673" height="441" alt="image" src="https://github.com/user-attachments/assets/0afe552e-2de1-4b1d-80de-cacaa4938cfe" />

**Total Time Spent:1.7hrs**

## Nov 1 2026<firmware>
ok so i have no idea on how to host on a server so i finished the firmware for esp32 first on ardunio IDE , i kept the esp32 firmware simple and ill be using the website and its server for the api fetching and stuff
so i searched online for free tracking api and found 3 websites , 1.Ship24 2.AfterShip both of which was NOT free and didnt give me an API key but 3. Trackcourier.io was free and gave me an API key so my local host is running thanks to that. and i have never done this before , i have hosted a server on Nest for my slack bot but i followed the guide line by line so idk much abt it but after creating a server.js index.html and .env file(so my api doesnt get leaked) the local host is up and running but i had to fix a lot of silly errors since its my first time so i spent most of the time debbuing so the website is just pure slop rn ill change it soon , its AI slop only to check if the API works and it does .
Im plannign to use more than 1 api key so if one hits the limit/doest work it move to the next one automatically 
here is the images <img width="1125" height="573" alt="image" src="https://github.com/user-attachments/assets/f8d53279-6d67-43ad-bd44-9ae50dbe72f2" />
<img width="916" height="346" alt="image" src="https://github.com/user-attachments/assets/43e87203-5843-4101-9d68-a17c4df65410" />
<img width="452" height="125" alt="image" src="https://github.com/user-attachments/assets/184fb309-3c82-4625-bf5e-5520a886d216" />
<img width="628" height="319" alt="image" src="https://github.com/user-attachments/assets/cd85e05f-32c2-4479-8056-33b91cdba693" />
**TOtal time spent:4.8hrs**

## Nov 4 2026<server>
Ok so nest servers take time and Nest is down rn so i went with vercel (since i have never done this before , this was all new to me) after following yt tutorials i got THIS- <img width="699" height="485" alt="image" src="https://github.com/user-attachments/assets/11809720-6396-43eb-a428-6a759aedfc48" />
😭
after cryin for a while nest came back online but it will take a while for it too get approved ig so idk wht to do ;/ , ill edit the readme and add the BOM.csv now . ill see what i can do about hosting the server
**Total Time Spent:1.6hrs**
