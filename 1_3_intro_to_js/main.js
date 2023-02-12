console.log('hello world');

// console.log(document)
// console.log(window)

const input = document.getElementById("name-input")
// console.log(input)
// console.log(document.getElementById("name-input"))
const updateName = () => {
    // console.log('in update function')
    const userName = input.value;
    window.alert('Hello, welcome to class ${userName}')

}

// updateName();

let changeable = true
let constant = true
let counter = 0

function change() {
    changeable = false;
    const constant = false;
    // console.log(changeable, constant)
    counter = counter + 1
}

// change();
// change();
// change
// change
// console.log('counter', counter)
// console.log(changeable, constant)

var count = 0;
        var btn = document.getElementById("btn");
        var disp = document.getElementById("display");
          
        btn.onclick = function () {
            count++;
            disp.innerHTML = count;
        }
