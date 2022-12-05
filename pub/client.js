var socket = io();
Vue.createApp({
    data() {
        return {
            dogOffset: 0,
            winner: "no one",
            message: "Tug!"
        }
    },
    methods: {
        moveLeft() {
            socket.emit("moveLeft");
        },
        moveRight() {
            socket.emit("moveRight");
        },
        reset() {
            socket.emit("reset");
        }
    },
    mounted() {
        //Whenever the server tells us "updatePosition", we update to the new value provided.
        socket.on("updatePosition", (newOffset) => {
            this.dogOffset = newOffset;
        });
        socket.on("reset", (msg) => {
            console.log("Reset button");
            this.message = msg;
        })
        socket.on("winner", (winnerSide) => {
            this.winner = winnerSide;
            console.log(this.winner);
            this.message = this.winner + " has won!";
        })
    },
    computed: {
        currentDogOffset() {
            return {
                left: this.dogOffset + "px"
            };
        },
        checkWinner() {
            return {
                message: this.winner + "winneasdasdr"
            };
        }
    }
}).mount('#app');