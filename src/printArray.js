const arr = [1,2,3,4];

const printArrayItem = (arr) => {
    for (let i = 0; i < arr.length; i++) {
        console.log(arr[i]);
    }
}

const printArray = (arr, i = 0) => {
    if (i === arr.length) return;
    console.log(arr[i]);
    printArray(arr, i + 1);
}

printArrayItem(arr)
printArray(arr);
