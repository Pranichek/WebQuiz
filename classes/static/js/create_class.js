
let btn1 = document.querySelector(".sel1")
let btn2 = document.querySelector(".sel2")
let btn3 = document.querySelector(".obj")
let btn4 = document.querySelector(".choo")

btn1.addEventListener(
    "click", 
    () => {
            let oldList = btn1.querySelector(".list");
            if (oldList) {
                oldList.remove();
                return;
            }

            let newList = document.createElement("div");
            newList.className = "list";
            btn1.appendChild(newList);

            for (let i = 1; i <= 11; i++) {
                let newBox = document.createElement("div");
                newBox.className = "box";
                newBox.textContent = i;

                newBox.addEventListener("click", () => {
                    btn1.textContent = i;
                    newList.remove();
                });

                newList.appendChild(newBox);
            }

    }
)

btn2.addEventListener(
    "click", 
    () => {
            let oldList = btn2.querySelector(".list2");
            if (oldList) {
                oldList.remove();
                return;
            }

            let newList2 = document.createElement("div");
            newList2.className = "list2";
            btn2.appendChild(newList2);

            const alph = ["А", "Б", "В", "Г", "Д", "І"]
            for (let i = 0; i <= alph.length - 1; i++) {
                let newBox2 = document.createElement("div");
                newBox2.className = "box";
                newBox2.textContent = alph[i];

                newBox2.addEventListener("click", () => {
                    btn2.textContent = alph[i];
                    newList2.remove();
                });
                newList2.appendChild(newBox2);
            }
    }
)


btn3.addEventListener(
    "click", 
    () => {
            let oldList = btn3.querySelector(".list3");
            if (oldList) {
                oldList.remove();
                return;
            }
            let newList3 = document.createElement("div");
            newList3.className = "list3";
            btn3.appendChild(newList3);

            const alph = ["математика", "англійська", "програмування", "історія", "фізика", "хімія", "інше"]
            for (let i = 0; i <= alph.length - 1; i++) {
                let newBox3 = document.createElement("div");
                newBox3.className = "box2";
                newBox3.textContent = alph[i];

                newBox3.addEventListener("click", () => {
                    btn3.textContent = alph[i];
                    newList3.remove();
                });
                newList3.appendChild(newBox3);
            }
    }
)



btn4.addEventListener(
    "click", 
    () => {
            let oldList = btn4.querySelector(".list4");
            if (oldList) {
                oldList.remove();
                return;
            }
            let newList4 = document.createElement("div");
            newList4.className = "list4";
            btn4.appendChild(newList4);

            const type = ["Лише за кодом", "Лише за запрошенням"]
            for (let i = 0; i <= type.length - 1; i++) {
                let newBox4 = document.createElement("div");
                let circle = document.createElement("div");
                circle.className = "circle"
                newBox4.className = "box3";
                newBox4.textContent = type[i];

                newBox4.addEventListener("click", () => {
                    btn4.textContent = type[i];
                    newList4.remove();
                });
                newList4.appendChild(newBox4);
                newBox4.appendChild(circle)
            }
    }
)


