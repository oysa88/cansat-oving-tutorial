input.onButtonPressed(Button.A, function () {
    datalogger.log(
    datalogger.createCV("", 0),
    datalogger.createCV("", 0),
    datalogger.createCV("", 0)
    )
})
let høyde = høydeberegning.barometricHeight(
101325,
101325,
288,
0.0065,
0,
287,
9.81
)
