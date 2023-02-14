console.log('hello world');

// starting with count at 0
count = 0;

document.getElementById("count").innerHTML = count;

function countBtn(){
    count++;
    document.getElementById("count").innerHTML = count;
   }

   function resetBtn(){
    count=0;
    document.getElementById("count").innerHTML = count;
   }

// I gave up on replicating the name input into alert; couldn't get the sample script to work