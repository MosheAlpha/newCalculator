// create new Tamhil
class Tamhil {
    constructor(index, helpText, paths) {
        this.loans = [
            new Loan(index, 0, helpText, paths)
        ];
        this.helpText = helpText;
        this.paths = paths;
        this.number = index;
        this.total = 0;
        this.return_start = 0;
        this.return_end = 0;
        this.ratio = 0;
        this.paid_intrest = 0;
        this.paid_madad = 0;
        this.paid_intrest_madad = 0;
        this.table = [];
    }

    addNewLoan() {
        this.loans[this.loans.length] = new Loan(this.number, this.loans.length, this.helpText, this.paths);
        this.drawTamhil();
    }

    deleteLoan(num) {
        this.loans.splice(num, 1);

        for (var i = num; i < this.loans.length; i++) {
            this.loans[i].updateIndex(i);
        }

        this.drawTamhil();
        this.drawTotalTable();
    }

    async calculateTamhil() {
        this.total = 0;
        this.return_start = 0;
        this.return_end = 0;
        this.paid_intrest = 0;
        this.paid_madad = 0;
        this.paid_intrest_madad = 0;

        for (var i = 0; i < this.loans.length; i++) {
            this.total += parseFloat(this.loans[i].amount);
            this.return_start += this.loans[i].return_start;
            this.return_end += this.loans[i].return_end;
            this.paid_intrest += this.loans[i].paid_intrest;
            this.paid_madad += this.loans[i].paid_madad;
            this.paid_intrest_madad += this.loans[i].paid_intrest_madad;
        }

        if (this.total > 0) {
            this.ratio = (this.total + this.paid_intrest_madad) / this.total;
        }
        else {
            this.ratio = 0;
        }
    }

    async getTable() {
        this.table = [];

        for (var i = 0; i < this.loans.length; i++) {
            let table = this.loans[i].table;

            for (var counter = 1; counter < table.length; counter++) {
                if (typeof this.table[counter] === 'undefined') {
                    this.table[counter] = [];
                    this.table[counter][0] = 0;
                    this.table[counter][1] = 0;
                    this.table[counter][2] = 0;
                    this.table[counter][3] = 0;
                }

                this.table[counter][0] += parseFloat(this.loans[i].table[counter][0]);
                this.table[counter][1] += parseFloat(this.loans[i].table[counter][1]);
                this.table[counter][2] += parseFloat(this.loans[i].table[counter][2]);
                this.table[counter][3] += parseFloat(this.loans[i].table[counter][3]);
            }
        }
        this.drawBoard();

        this.drawTamhilContent();
        this.singleMonth($('#t' + (this.number + 1) + '-calc-single-month').val);
    }

    drawTamhil() {
        let html = '';

        for (var i = 0; i < this.loans.length; i++) {
            html += this.loans[i].drawLoan();
        }
        html += '<div class="add-new-loan-button"><div class=" new-loan-btn" onclick="tamhilim[' + this.number + '].addNewLoan();">';
        html += `<svg width="23" height="23" viewBox="0 0 23 23" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M11.75 0.462891C5.675 0.462891 0.75 5.38789 0.75 11.4629C0.75 17.5379 5.675 22.4629 11.75 22.4629C17.825 22.4629 22.75 17.5379 22.75 11.4629C22.75 5.38789 17.825 0.462891 11.75 0.462891ZM12.75 15.4629C12.75 15.7281 12.6446 15.9825 12.4571 16.17C12.2696 16.3575 12.0152 16.4629 11.75 16.4629C11.4848 16.4629 11.2304 16.3575 11.0429 16.17C10.8554 15.9825 10.75 15.7281 10.75 15.4629V12.4629H7.75C7.48478 12.4629 7.23043 12.3575 7.04289 12.17C6.85536 11.9825 6.75 11.7281 6.75 11.4629C6.75 11.1977 6.85536 10.9433 7.04289 10.7558C7.23043 10.5682 7.48478 10.4629 7.75 10.4629H10.75V7.46289C10.75 7.19767 10.8554 6.94332 11.0429 6.75578C11.2304 6.56825 11.4848 6.46289 11.75 6.46289C12.0152 6.46289 12.2696 6.56825 12.4571 6.75578C12.6446 6.94332 12.75 7.19767 12.75 7.46289V10.4629H15.75C16.0152 10.4629 16.2696 10.5682 16.4571 10.7558C16.6446 10.9433 16.75 11.1977 16.75 11.4629C16.75 11.7281 16.6446 11.9825 16.4571 12.17C16.2696 12.3575 16.0152 12.4629 15.75 12.4629H12.75V15.4629Z" fill="#005296"/>
        </svg>`;
        html += `הוסף מסלול</div>`;
        $('#calc-t' + (this.number + 1)).html(html);
        if (this.number == 0) {
            new_changeTamhil("t1");
        }

    }
    //שורת תוצאות עבור כל תמהיל
    async drawTotalTable() {
        await this.calculateTamhil();

        let html = '';

        html += '<tr><td><b><span id="t' + (this.number + 1) + '-total-loans-keren">' + this.total.toLocaleString('us', { minimumFractionDigits: 0, maximumFractionDigits: 0 }) + '</span> </b></td>';
        html += '<td><b><span id="t' + (this.number + 1) + '-total-loans-return">' + this.return_start.toLocaleString('us', { minimumFractionDigits: 0, maximumFractionDigits: 0 }) + '</span> </b></td>';
        html += '<td><b><span id="t' + (this.number + 1) + '-total-loans-return-end">' + this.return_end.toLocaleString('us', { minimumFractionDigits: 0, maximumFractionDigits: 0 }) + '</span> </b></td>';
        html += '<td><b><span id="t' + (this.number + 1) + '-total-loans-ratio">' + this.ratio.toLocaleString('us', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + '</span></b></td>';
        html += '<td><b><span id="t' + (this.number + 1) + '-total-loans-only-intrest">' + this.paid_intrest.toLocaleString('us', { minimumFractionDigits: 0, maximumFractionDigits: 0 }) + '</span> </b></td>';
        let t = parseFloat(this.paid_madad).toFixed(2);
        t = t == 0 || isNaN(t) ? 0 : Math.round(t);
        html += '<td><b><span id="t' + (this.number + 1) + '-total-loans-only-madad">' + t.toLocaleString('he', { minimumFractionDigits: 0, maximumFractionDigits: 0 }) + '</span> </b></td>';
        html += '<td><b><span id="t' + (this.number + 1) + '-total-loans-intrest">' + this.paid_intrest_madad.toLocaleString('us', { minimumFractionDigits: 0, maximumFractionDigits: 0 }) + '</span> </b></td></tr>';

        $('#calc-total-t' + (this.number + 1) + '-table').html(html);

        this.getTable();
    }

    singleMonth(month) {
        if (month != '' && month < this.table.length) {
            $('#t' + (this.number + 1) + '-calc-single-month-return').html(this.table[month][3].toLocaleString('us', { minimumFractionDigits: 0, maximumFractionDigits: 0 }));
            $('#t' + (this.number + 1) + '-calc-single-month-keren').html(this.table[month][0].toLocaleString('us', { minimumFractionDigits: 0, maximumFractionDigits: 0 }));
        }
        else {
            $('#t' + (this.number + 1) + '-calc-single-month-return').html(0);
            $('#t' + (this.number + 1) + '-calc-single-month-keren').html(0);
        }
    }

    //מצייר לוח סילוקין עבור כל התמהיל
    drawBoard() {
        let html = '';
        if (this.table.length > 1) {
            for (var i = 1; i < this.table.length; i++) {
                html += '<tr><td>' + i + '</td><td>' + parseFloat(this.table[i][0]).toLocaleString('us', { minimumFractionDigits: 0, maximumFractionDigits: 0 }) + '</td>';
                html += '<td>' + this.table[i][1].toLocaleString('us', { minimumFractionDigits: 0, maximumFractionDigits: 0 }) + '</td>';
                html += '<td>' + this.table[i][2].toLocaleString('us', { minimumFractionDigits: 0, maximumFractionDigits: 0 }) + '</td>';
                html += '<td>' + this.table[i][3].toLocaleString('us', { minimumFractionDigits: 0, maximumFractionDigits: 0 }) + '</td></tr>';
            }
        } else {
            for (var i = 1; i < 6; i++) {
                html += '<tr><td>' + i + '</td><td>-</td><td>-</td><td>-</td><td>-</td></tr>';
            }
        }


        $('#calc-total-board-t' + (this.number + 1) + '-inner').html(html);
    }

    //טבלאות בסוף העמוד
    drawTamhilContent() {
        let html = '';
        //console.log( "madad "+this.paid_madad)
        let ratio = typeof (this.ratio) == "undefined" ? 0 : this.ratio.toLocaleString('us', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

        html += '<div class="row"><div  id="tamhil-content-data tamhil-content-data-t' + (this.number + 1) + '-1">' + this.total.toLocaleString('us', { minimumFractionDigits: 0, maximumFractionDigits: 0 }) + '</div></div>';
        html += '<div class="row"><div  id="tamhil-content-data tamhil-content-data-t' + (this.number + 1) + '-2">' + this.return_start.toLocaleString('us', { minimumFractionDigits: 0, maximumFractionDigits: 0 }) + '</div></div>';
        html += '<div class="row"><div  id="tamhil-content-data tamhil-content-data-t' + (this.number + 1) + '-3">' + this.return_end.toLocaleString('us', { minimumFractionDigits: 0, maximumFractionDigits: 0 }) + '</div></div>';
        html += '<div class="row"><div  id="tamhil-content-data tamhil-content-data-t' + (this.number + 1) + '-4">' + ratio + '</div></div>';
        html += '<div class="row"><div  id="tamhil-content-data tamhil-content-data-t' + (this.number + 1) + '-5">' + this.paid_intrest.toLocaleString('us', { minimumFractionDigits: 0, maximumFractionDigits: 0 }) + '</div></div>';
        let t = this.paid_madad;
        t = t == 0 || isNaN(t) ? 0 : t;
        html += '<div class="row"><div  id="tamhil-content-data tamhil-content-data-t' + (this.number + 1) + '-6">' + t.toLocaleString('us', { minimumFractionDigits: 0, maximumFractionDigits: 0 }) + '</div></div>';
        html += '<div class="row"><div  id="tamhil-content-data tamhil-content-data-t' + (this.number + 1) + '-7">' + this.paid_intrest_madad.toLocaleString('us', { minimumFractionDigits: 0, maximumFractionDigits: 0 }) + '</div></div>';
        $('tamhil-content-t' + (this.number + 1)).html(html);
        if (this.number == 0) {
            new_changeTamhil("t1");
        }

    }

    //פותח לוח סילוקין עבור כל תמהיל
    showTamhilTable(id) {
        let x = $('#calc-row-board-' + id);
        let button = $('#t' + id + '-tamhil-button');

        if (x.css("display") === "none" || x.css("display") != "block") {
            x.css("opacity",  1);
            x.css("transform",  'scale(1)');
            x.css("display",  "block");
            button.html("הסתר לוח סילוקין כולל");

        } else if (x.css("display") === "block") {
            x.css("opacity",  0);
            x.css("transform",  'scale(0)');
            x.css("display",  'none');
            button.html("הצג לוח סילוקין כולל");

        }
    }


    showInputs() {
        for (var i = 0; i < this.loans.length; i++) {
            this.loans[i].showInputs();
        }
    }

    hideInputs() {
        for (var i = 0; i < this.loans.length; i++) {
            this.loans[i].hideInputs();
        }
    }
}

class Loan {
    constructor(tamhil, index, helpText, paths) {
        this.helpText = helpText;
        this.paths = paths;
        this.tamhil = tamhil;
        this.number = index;
        this.amount = 0;
        this.period = 0;
        this.grace = 0;
        this.track = '';
        this.type = '';
        this.range = '';
        this.intrest = CURRENT_INTEREST;
        this.madad = 0;
        this.return_start = 0;
        this.return_end = 0;
        this.ratio = 0;
        this.paid_intrest = 0;
        this.paid_madad = 0;
        this.paid_intrest_madad = 0;
        this.table = [];
    }

    updateIndex(num) {
        this.number = num;
    }
    //משנה את ערכי ריבית ומדד לפי מסלול הלוואה מקובץ JSON
    changeTrack() {
        let loanSelect = $('#t' + this.tamhil + '-loan' + this.number +  '-select-loan-name');
        let loanInput = $('#t' + this.tamhil + '-loan' + this.number +  '-input-loan-name');
        let loanInterest = $('#t' + this.tamhil + '-loan' + this.number + '-intrest');
        let loanMadad = $('#t' + this.tamhil + '-loan' + this.number + '-madad');
        let loanInterestRange = $('#t' + this.tamhil + '-loan' + this.number + '-interest-range');

        if(loanSelect.val() == "ללא מסלול" ){
            loanInterest.val() = CURRENT_INTEREST;
            loanMadad.val() = 0;
            loanInterestRange.html("");
            this.track = loanSelect.val();
            return;
        }

        if(loanSelect.val() == "אחר"){
            loanInterest.val() = CURRENT_INTEREST;
            loanMadad.val() = 0;
            loanInterestRange.html("");
            this.track = loanInput.val();

            loanSelect.css("display", "none");
            loanInput.css("display", "block");
            return;
        }

        let curentPath = this.paths[loanSelect.val()];

        this.track =  curentPath.name;
        this.intrest = curentPath.start;
        this.madad = curentPath.madad;
        this.range = curentPath.start + "-" + curentPath.end;

        loanInterest.val(this.intrest);
        loanMadad.val(this.madad);
        
        //change interest range
        loanInterestRange.html('טווח רצוי: ' + this.range);

    }

    calculateLoan() {

        if (this.amount != 0 && this.amount != '' && !isNaN(this.amount) && this.period != 0 && this.period != '' && this.type != '' && this.intrest > 0 && !isNaN(this.intrest) && !isNaN(this.madad)) {
            let amount = parseInt(this.amount);
            let period = parseInt(this.period);
            let grace = parseInt(this.grace);
            let type = parseInt(this.type);

            let intrestMonthly = parseFloat(this.intrest) / 1200;
            let inflationMonthly = parseFloat(this.madad) / 1200;
            let maanas = (1 - (1 / Math.pow(1 + intrestMonthly, (period - grace)))) / intrestMonthly;
            this.table = [];
            if (type == 1) {
                if (grace == 0) {
                    this.table[1] = [];
                    this.table[1][0] = amount;
                    this.table[1][2] = this.table[1][0] * intrestMonthly;
                    this.table[1][3] = this.table[1][0] / maanas;
                    this.table[1][1] = (this.table[1][0] > 1 ? this.table[1][3] - this.table[1][2] : 0);
                    this.table[1][4] = this.table[1][3];
                    this.table[1][5] = this.table[1][2];
                }
                else {
                    this.table[1] = [];
                    this.table[1][0] = amount;
                    this.table[1][2] = this.table[1][0] * intrestMonthly;
                    this.table[1][3] = this.table[1][2];
                    this.table[1][1] = 0;
                    this.table[1][4] = this.table[1][3];
                    this.table[1][5] = this.table[1][2];
                }

                for (var counter = 2; counter <= period; counter++) {
                    this.table[counter] = [];

                    if (counter <= grace) {
                        this.table[counter][0] = (this.table[counter - 1][0] - this.table[counter - 1][1]) + (this.table[counter - 1][0] * inflationMonthly);
                        this.table[counter][2] = this.table[counter][0] * intrestMonthly;
                        this.table[counter][3] = this.table[counter][2];
                        this.table[counter][1] = 0;
                        this.table[counter][4] = this.table[counter - 1][4] + this.table[counter][3];
                        this.table[counter][5] = this.table[counter - 1][5] + this.table[counter][2];
                    }
                    else {
                        if (counter == (grace + 1)) {
                            this.table[counter][0] = (this.table[counter - 1][0] - this.table[counter - 1][1]) + (this.table[counter - 1][0] * inflationMonthly);
                            this.table[counter][2] = this.table[counter][0] * intrestMonthly;
                            this.table[counter][3] = this.table[counter][0] / maanas;
                            this.table[counter][1] = (this.table[counter][0] > 1 ? this.table[counter][3] - this.table[counter][2] : 0);
                            this.table[counter][4] = this.table[counter - 1][4] + this.table[counter][3];
                            this.table[counter][5] = this.table[counter - 1][5] + this.table[counter][2];
                        }
                        else {
                            this.table[counter][0] = (this.table[counter - 1][0] - this.table[counter - 1][1]) * (1 + inflationMonthly);
                            this.table[counter][2] = this.table[counter][0] * intrestMonthly;
                            this.table[counter][3] = (this.table[counter][0] < 1 ? 0 : this.table[counter - 1][3] * (1 + inflationMonthly));
                            this.table[counter][1] = (this.table[counter][0] > 1 ? this.table[counter][3] - this.table[counter][2] : 0);
                            this.table[counter][4] = this.table[counter - 1][4] + this.table[counter][3];
                            this.table[counter][5] = this.table[counter - 1][5] + this.table[counter][2];
                        }
                    }
                }
            }

            if (type == 2) {
                if (grace == 0) {
                    this.table[1] = [];
                    this.table[1][0] = amount;
                    this.table[1][1] = (this.table[1][0] > 1 ? amount / period : 0);
                    this.table[1][2] = (this.table[1][0] * intrestMonthly);
                    this.table[1][3] = this.table[1][1] + this.table[1][2];
                    this.table[1][4] = this.table[1][3];
                    this.table[1][5] = this.table[1][2];
                }
                else {
                    this.table[1] = [];
                    this.table[1][0] = amount;
                    this.table[1][1] = 0;
                    this.table[1][2] = (this.table[1][0] * intrestMonthly);
                    this.table[1][3] = this.table[1][1] + this.table[1][2];
                    this.table[1][4] = this.table[1][3];
                    this.table[1][5] = this.table[1][2];
                }

                for (counter = 2; counter <= period; counter++) {
                    this.table[counter] = [];

                    if (counter <= grace) {
                        this.table[counter][0] = (this.table[counter - 1][0] - this.table[counter - 1][1]) + (this.table[counter - 1][0] * inflationMonthly);
                        this.table[counter][1] = 0;
                        this.table[counter][2] = this.table[counter][0] * intrestMonthly;;
                        this.table[counter][3] = this.table[counter][1] + this.table[counter][2];
                        this.table[counter][4] = this.table[counter - 1][4] + this.table[counter][3];
                        this.table[counter][5] = this.table[counter - 1][5] + this.table[counter][2];
                    }
                    else {
                        this.table[counter][0] = (this.table[counter - 1][0] - this.table[counter - 1][1]) + (this.table[counter - 1][0] * inflationMonthly);
                        this.table[counter][1] = (this.table[1][0] > 1 ? this.table[counter][0] / (this.period - counter + 1) : 0);
                        this.table[counter][2] = this.table[counter][0] * intrestMonthly;;
                        this.table[counter][3] = this.table[counter][1] + this.table[counter][2];
                        this.table[counter][4] = this.table[counter - 1][4] + this.table[counter][3];
                        this.table[counter][5] = this.table[counter - 1][5] + this.table[counter][2];
                    }
                }
            }

            if (type == 3) {
                this.table[1] = [];
                this.table[1][0] = amount;
                this.table[1][1] = 0;
                this.table[1][2] = (this.table[1][0] * intrestMonthly);
                this.table[1][3] = this.table[1][1] + this.table[1][2];
                this.table[1][4] = this.table[1][3];
                this.table[1][5] = this.table[1][2];

                for (counter = 2; counter <= period; counter++) {
                    this.table[counter] = [];

                    if (counter < grace) {
                        this.table[counter][0] = (this.table[counter - 1][0] - this.table[counter - 1][1]) + (this.table[counter - 1][0] * inflationMonthly);
                        this.table[counter][1] = 0;
                        this.table[counter][2] = this.table[counter][0] * intrestMonthly;;
                        this.table[counter][3] = this.table[counter][1] + this.table[counter][2];
                        this.table[counter][4] = this.table[counter - 1][4] + this.table[counter][3];
                        this.table[counter][5] = this.table[counter - 1][5] + this.table[counter][2];
                    }
                    else {
                        this.table[counter][0] = (this.table[counter - 1][0] - this.table[counter - 1][1]) + (this.table[counter - 1][0] * inflationMonthly);
                        this.table[counter][1] = (this.table[1][0] > 1 ? this.table[counter][0] / (this.period - counter + 1) : 0);
                        this.table[counter][2] = this.table[counter][0] * intrestMonthly;;
                        this.table[counter][3] = this.table[counter][1] + this.table[counter][2];
                        this.table[counter][4] = this.table[counter - 1][4] + this.table[counter][3];
                        this.table[counter][5] = this.table[counter - 1][5] + this.table[counter][2];
                    }
                }
            }

            this.return_start = this.table[1][3];
            this.return_end = this.table[this.period][3];
            this.ratio = this.table[this.period][4] / this.amount;
            this.paid_intrest_madad = this.table[this.period][4] - this.amount;
            this.paid_intrest = this.table[this.period][5];
            this.paid_madad = this.paid_intrest_madad - this.paid_intrest;

            this.drawSummary();
            this.showBoard();
            tamhilim[this.tamhil].drawTotalTable();
        } else {
            this.drawSummary(1);
            this.showBoard(1);
        }


    }
    //יוצר LOAN חדש
    drawLoan() {
        let html = '';

        html += '<div class="template-loan-1" id="calc-row t' + this.tamhil + '-loan' + this.number + '"><div class="" id="calc-row-input calc-row-input-t' + this.tamhil + '-loan' + this.number + '"><div class="template-loan-total-results-row">';
        // Item1
        html += '<div class="item"> <label for="" class="name" data-toggle="tooltip" data-placement="top">מספר</label>';
        html += '<span id="calc-row-number">' + (parseInt(this.number) + 1) + '</span></div>'
        //item2
        html += '<div class="item"><label data-toggle="tooltip" data-placement="top" title="' + this.helpText.text4 + '">מסלול</label>';
        html += '<select onchange="tamhilim[' + this.tamhil + '].loans[' + this.number + '].changeTrack(); tamhilim[' + this.tamhil + '].loans[' + this.number + '].calculateLoan();" id="t' + this.tamhil + '-loan' + this.number + '-select-loan-name">';
        html += '<option value="אחר">אחר</option>';
        html += '<option value="ללא מסלול" selected>ללא מסלול</option>';
        for (var i = 0; i < this.paths.length; i++) {
            
            html += '<option value="' + this.paths[i].id + '" ' + (this.track == (i) ? 'selected="selected"' : '') + '>' + this.paths[i].name + '</option>';
        }
        
        this.range = this.paths[0].start + "-" + this.paths[0].end;

        html += '</select><input type="text" style="display:none; text-align:right;" id="t' + this.tamhil + '-loan' + this.number + '-input-loan-name"  onchange="tamhilim[' + this.tamhil + '].loans[' + this.number + '].changeTrack(); tamhilim[' + this.tamhil + '].loans[' + this.number + '].calculateLoan();" placeholder="הקלידו כאן"></div>';
        // item3
        html += '<div class="item"><label data-toggle="tooltip" data-placement="top" title="' + this.helpText.text1 + '">סכום</label>';
        html += '<input type="text" value="' + (this.amount !== 0 ? this.amount : "") + '" oninput="tamhilim[' + this.tamhil + '].loans[' + this.number + '].amount = this.value; tamhilim[' + this.tamhil + '].loans[' + this.number + '].calculateLoan();"></div>';
        html += '<div class="item"><label data-toggle="tooltip" data-placement="top" title="' + this.helpText.text2 + '">תקופה בחודשים</label>';
        html += '<select onchange="tamhilim[' + this.tamhil + '].loans[' + this.number + '].period = this.value; tamhilim[' + this.tamhil + '].loans[' + this.number + '].calculateLoan();"><option value=""></option>';

        for (var i = 1; i <= 360; i++) {
            if (i % 12 == 0) {
                html += '<option value="' + i + '" ' + (this.period == i ? 'selected="selected"' : '') + '>' + i + ' חודשים (' + (i / 12) + ' שנים)</option>';
            }
            else {
                html += '<option value="' + i + '" ' + (this.period == i ? 'selected="selected"' : '') + '>' + i + ' חודשים</option>';
            }
        }

        html += '</select></div><div class="item"><label data-toggle="tooltip" data-placement="top" title="' + this.helpText.text3 + '">תקופת גרייס בחודשים</label>';
        html += '<select onchange="tamhilim[' + this.tamhil + '].loans[' + this.number + '].grace = this.value; tamhilim[' + this.tamhil + '].loans[' + this.number + '].calculateLoan();"><option value="0">ללא תקופת גרייס</option>';
        
        for (var i = 1; i <= 360; i++) {
            if (i % 12 == 0) {
                html += '<option value="' + i + '" ' + (this.grace == i ? 'selected="selected"' : '') + '>' + i + ' חודשים (' + (i / 12) + ' שנים)</option>';
            }
            else {
                html += '<option value="' + i + '" ' + (this.grace == i ? 'selected="selected"' : '') + '>' + i + ' חודשים</option>';
            }
        }

        html += '</select></div>';
        html += '<div class="item"><label data-toggle="tooltip" data-placement="top" title="' + this.helpText.text5 + '">שיטת החזר</label>';
        html += '<select onchange="tamhilim[' + this.tamhil + '].loans[' + this.number + '].type = this.value; tamhilim[' + this.tamhil + '].loans[' + this.number + '].calculateLoan();"><option value=""></option><option value="1" ' + (this.type == 1 ? 'selected="selected"' : '') + '>שפיצר</option>';
        html += '<option value="2"  ' + (this.type == 2 ? 'selected="selected"' : '') + '>קרן שווה</option><option value="3"  ' + (this.type == 3 ? 'selected="selected"' : '') + '>גרייס</option></select></div>';
        html += '<div class="item"><label data-toggle="tooltip" data-placement="top" title="' + this.helpText.text6 + '">ריבית<span class="interestRange" id="t' + this.tamhil + '-loan' + this.number + '-interest-range">טווח רצוי: '+  this.range +'</span></label>';
        html += '<input type="text" id="t' + this.tamhil + '-loan' + this.number + '-intrest" value="' + this.intrest + '" oninput="tamhilim[' + this.tamhil + '].loans[' + this.number + '].intrest = this.value; tamhilim[' + this.tamhil + '].loans[' + this.number + '].calculateLoan();"></div>';
        html += '<div class="item"><label data-toggle="tooltip" data-placement="top" title="' + this.helpText.text7 + '">מדד</label>';
        html += '<input type="text" id="t' + this.tamhil + '-loan' + this.number + '-madad" value="' + this.madad + '" oninput="tamhilim[' + this.tamhil + '].loans[' + this.number + '].madad = this.value; tamhilim[' + this.tamhil + '].loans[' + this.number + '].calculateLoan();"></div></div></div>';
        //html += '<div  id="calc-row-sum"><div class="row"><div ><img src="/images/calc/up-arrow.png" id="t' + this.tamhil + '-loan' + this.number + '-toggle" onclick="tamhilim[' + this.tamhil + '].loans[' + this.number + '].toggleInputs();" />';
        html += '<div id="t' + this.tamhil + '-loan' + this.number + '-summary" class="loan-results-table-row"> ';

        html += '<table cellspacing="0" cellpadding="0" border="0" width="100%" ><thead><tr><th>החזר התחלתי</th><th>החזר בסוף תקופה</th><th>יחס החזר</th><th>סה״כ ריבית</th><th>סה״כ הצמדה</th><th>ריבית + הצמדה</th></tr></thead>';
        html += '<tbody><tr><td><b>' + this.return_start.toLocaleString('us', { minimumFractionDigits: 0, maximumFractionDigits: 0 }) + ' </b></td>';
        html += '<td><b>' + this.return_end.toLocaleString('us', { minimumFractionDigits: 0, maximumFractionDigits: 0 }) + '</b></td>';
        let xy = this.ratio.toLocaleString('us', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) == 0 ? 0 : this.ratio.toLocaleString('us', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
        html += '<td><b>' + xy + ' </b></td>';
        html += '<td><b>' + this.paid_intrest.toLocaleString('us', { minimumFractionDigits: 0, maximumFractionDigits: 0 }) + ' </b></td>';
        html += '<td><b>' + this.paid_madad.toLocaleString('us', { minimumFractionDigits: 0, maximumFractionDigits: 0 }) + ' </b></td>';
        html += '<td><b>' + this.paid_intrest_madad.toLocaleString('us', { minimumFractionDigits: 0, maximumFractionDigits: 0 }) + ' </b></td></tr></tbody></table></div>';

        html += '<div class="template-loan-buttons-row"><button id="calc-delete-btn" onclick="tamhilim[' + this.tamhil + '].deleteLoan(' + this.number + ')">';
        html += `<svg width="16" height="18" viewBox="0 0 16 18" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M5.6875 7.44043V12.9404C5.6875 13.1228 5.75993 13.2976 5.88886 13.4266C6.0178 13.5555 6.19266 13.6279 6.375 13.6279C6.55734 13.6279 6.7322 13.5555 6.86114 13.4266C6.99007 13.2976 7.0625 13.1228 7.0625 12.9404V7.44043C7.0625 7.25809 6.99007 7.08323 6.86114 6.95429C6.7322 6.82536 6.55734 6.75293 6.375 6.75293C6.19266 6.75293 6.0178 6.82536 5.88886 6.95429C5.75993 7.08323 5.6875 7.25809 5.6875 7.44043Z" fill="white"/>
        <path d="M9.125 6.75293C9.30734 6.75293 9.48221 6.82536 9.61114 6.95429C9.74007 7.08323 9.8125 7.25809 9.8125 7.44043V12.9404C9.8125 13.1228 9.74007 13.2976 9.61114 13.4266C9.48221 13.5555 9.30734 13.6279 9.125 13.6279C8.94266 13.6279 8.76779 13.5555 8.63886 13.4266C8.50993 13.2976 8.4375 13.1228 8.4375 12.9404V7.44043C8.4375 7.25809 8.50993 7.08323 8.63886 6.95429C8.76779 6.82536 8.94266 6.75293 9.125 6.75293Z" fill="white"/>
        <path d="M10.5 3.31543H14.625C14.8073 3.31543 14.9822 3.38786 15.1111 3.51679C15.2401 3.64573 15.3125 3.82059 15.3125 4.00293C15.3125 4.18527 15.2401 4.36013 15.1111 4.48907C14.9822 4.618 14.8073 4.69043 14.625 4.69043H13.8646L12.8306 14.0074C12.7372 14.8483 12.337 15.6252 11.7066 16.1894C11.0761 16.7536 10.2598 17.0655 9.41375 17.0654H6.08625C5.24021 17.0655 4.42385 16.7536 3.79342 16.1894C3.16299 15.6252 2.76278 14.8483 2.66937 14.0074L1.634 4.69043H0.875C0.692664 4.69043 0.517795 4.618 0.388864 4.48907C0.259933 4.36013 0.1875 4.18527 0.1875 4.00293C0.1875 3.82059 0.259933 3.64573 0.388864 3.51679C0.517795 3.38786 0.692664 3.31543 0.875 3.31543H5C5 2.58608 5.28973 1.88661 5.80546 1.37089C6.32118 0.855161 7.02065 0.56543 7.75 0.56543C8.47935 0.56543 9.17882 0.855161 9.69454 1.37089C10.2103 1.88661 10.5 2.58608 10.5 3.31543V3.31543ZM7.75 1.94043C7.38533 1.94043 7.03559 2.0853 6.77773 2.34316C6.51987 2.60102 6.375 2.95076 6.375 3.31543H9.125C9.125 2.95076 8.98013 2.60102 8.72227 2.34316C8.46441 2.0853 8.11467 1.94043 7.75 1.94043V1.94043ZM3.01863 4.69043L4.03612 13.8562C4.09229 14.3606 4.33248 14.8266 4.71072 15.165C5.08897 15.5034 5.57871 15.6905 6.08625 15.6904H9.41375C9.92105 15.6902 10.4105 15.5029 10.7884 15.1646C11.1664 14.8262 11.4064 14.3604 11.4625 13.8562L12.4828 4.69043H3.02H3.01863Z" fill="white"/>
        </svg>`;
        html += 'מחק מסלול</button>';
        html += '<button id="calc-watch-silukin-btn" onclick="tamhilim[' + this.tamhil + '].loans[' + this.number + '].showBoard(); tamhilim[' + this.tamhil + '].loans[' + this.number + '].openBoard()">';
        html += `<svg width="18" height="17" viewBox="0 0 18 17" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M17.6953 14.6045H2.24219V0.588867C2.24219 0.490039 2.16133 0.40918 2.0625 0.40918H0.804688C0.705859 0.40918 0.625 0.490039 0.625 0.588867V16.042C0.625 16.1408 0.705859 16.2217 0.804688 16.2217H17.6953C17.7941 16.2217 17.875 16.1408 17.875 16.042V14.7842C17.875 14.6854 17.7941 14.6045 17.6953 14.6045ZM4.21875 12.8076H5.47656C5.57539 12.8076 5.65625 12.7268 5.65625 12.6279V9.39355C5.65625 9.29473 5.57539 9.21387 5.47656 9.21387H4.21875C4.11992 9.21387 4.03906 9.29473 4.03906 9.39355V12.6279C4.03906 12.7268 4.11992 12.8076 4.21875 12.8076ZM7.63281 12.8076H8.89062C8.98945 12.8076 9.07031 12.7268 9.07031 12.6279V5.44043C9.07031 5.3416 8.98945 5.26074 8.89062 5.26074H7.63281C7.53398 5.26074 7.45312 5.3416 7.45312 5.44043V12.6279C7.45312 12.7268 7.53398 12.8076 7.63281 12.8076ZM11.0469 12.8076H12.3047C12.4035 12.8076 12.4844 12.7268 12.4844 12.6279V7.19238C12.4844 7.09355 12.4035 7.0127 12.3047 7.0127H11.0469C10.948 7.0127 10.8672 7.09355 10.8672 7.19238V12.6279C10.8672 12.7268 10.948 12.8076 11.0469 12.8076ZM14.4609 12.8076H15.7188C15.8176 12.8076 15.8984 12.7268 15.8984 12.6279V3.64355C15.8984 3.54473 15.8176 3.46387 15.7188 3.46387H14.4609C14.3621 3.46387 14.2812 3.54473 14.2812 3.64355V12.6279C14.2812 12.7268 14.3621 12.8076 14.4609 12.8076Z" fill="white"/>
        </svg>`;
        html += `<span id="t` + this.tamhil + `-loan` + this.number + `-button">הצג לוח סילוקין פרטני</span>`;
        html += '</button></div>';

        html += '<div class="calc-row-board" id="t' + this.tamhil + '-loan' + this.number + '-board" style="display:none;">';
        html += '<table cellspacing="0" cellpadding="5" border="0"><thead><tr id="mortage_table_header"><th>חודש</th><th>יתרת קרן</th><th>החזר ע"ח קרן</th><th>החזר ע"ח ריבית</th><th>סה"כ החזר התחלתי</th></tr></thead>';
        html += '<tbody id="t' + this.tamhil + '-loan' + this.number + '-board-inner" class="tableBox"></tbody></table></div></div>';

        return html;
    }
    //שורת תוצאות עבור LOAN אחד
    drawSummary(reload = 0) {
        let html = '';
        if (reload === 0) {
            html += '<table cellspacing="0" cellpadding="0" border="0" width="100%" class="text-center"><thead><tr><th>החזר התחלתי</th><th>החזר בסוף תקופה</th><th>יחס החזר</th><th>סה״כ ריבית</th><th>סה״כ הצמדה</th><th>ריבית + הצמדה</th></tr></thead>';
            html += '<tbody><tr><td><b>' + this.return_start.toLocaleString('us', { minimumFractionDigits: 0, maximumFractionDigits: 0 }) + ' </b></td>';
            html += '<td><b>' + this.return_end.toLocaleString('us', { minimumFractionDigits: 0, maximumFractionDigits: 0 }) + ' </b></td>';
            html += '<td><b>' + this.ratio.toLocaleString('us', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' </b></td>';
            html += '<td><b>' + this.paid_intrest.toLocaleString('us', { minimumFractionDigits: 0, maximumFractionDigits: 0 }) + ' </b></td>';
            let t = parseFloat(this.paid_madad).toFixed(2);
            t = t == 0 || isNaN(t) ? 0 : Math.round(t);
            html += '<td><b>' + t.toLocaleString('us', { minimumFractionDigits: 0, maximumFractionDigits: 0 }) + ' </b></td>';
            html += '<td><b>' + this.paid_intrest_madad.toLocaleString('us', { minimumFractionDigits: 0, maximumFractionDigits: 0 }) + ' </b></td></tr></tbody></table></div>';
        } else {
            html += '<table cellspacing="0" cellpadding="0" border="0" width="100%" class="text-center"><thead><tr><th>החזר התחלתי</th><th>החזר בסוף תקופה</th><th>יחס החזר</th><th>סה״כ ריבית</th><th>סה״כ הצמדה</th><th>ריבית + הצמדה</th></tr></thead>';
            html += '<tbody><tr><td><b>0 </b></td>';
            html += '<td><b>0 </b></td>';
            html += '<td><b>0 </b></td>';
            html += '<td><b>0 </b></td>';
            html += '<td><b>0 </b></td>';
            html += '<td><b>0 </b></td>';
            html += '</tbody></table></div>';
        }

        $('#t' + this.tamhil + '-loan' + this.number + '-summary').html(html);

    }
    //לוח סילוקין עבור LOAN אחד
    showBoard(reload = 0) {
        let html = '';
        if (reload === 0) {
            for (var i = 1; i <= this.period; i++) {
                html += '<tr><td>' + i + '</td><td>' + parseFloat(this.table[i][0]).toLocaleString('us', { minimumFractionDigits: 0, maximumFractionDigits: 0 }) + '</td>';
                html += '<td>' + this.table[i][1].toLocaleString('us', { minimumFractionDigits: 0, maximumFractionDigits: 0 }) + '</td>';
                html += '<td>' + this.table[i][2].toLocaleString('us', { minimumFractionDigits: 0, maximumFractionDigits: 0 }) + '</td>';
                html += '<td>' + this.table[i][3].toLocaleString('us', { minimumFractionDigits: 0, maximumFractionDigits: 0 }) + '</td></tr>';
            }
        }

        $('#t' + this.tamhil + '-loan' + this.number + '-board-inner').html(html);

    }
    openBoard() {
        let x = $('#t' + this.tamhil + '-loan' + this.number + '-board');
        let button = $('#t' + this.tamhil + '-loan' + this.number + '-button');

        if (x.css("display") === "none" || x.css("display") != "block") {
            x.css("opacity",  1);
            x.css("transform",  'scale(1)');
            x.css("display",  "block");
            button.html("הסתר לוח סילוקין פרטני");

        } else if (x.css("display") === "block") {
            x.css("opacity",  0);
            x.css("transform",  'scale(0)');
            x.css("display", 'none');
            button.html("הצג לוח סילוקין פרטני");
        }
    }

}

var tamhilim = [];

//משנה את תמהיל שנראה ברגע זה
var new_changeTamhil = function (calcId) {
    $("#calc-t1").css("display", "none");
    $("#calc-t2").css("display", "none");
    $("#calc-t3").css("display", "none");
    $("#calc-t4").css("display", "none");
    $('#calc-' + calcId).css("display", "block");

    //change background of Tamhil buttons
    for (let i = 0; i < 4; i++) {
        if (document.getElementsByClassName("tamhil-name")[i].classList.contains("active"))
        document.getElementsByClassName("tamhil-name")[i].classList.remove("active");
        document.getElementsByClassName("tamhil-name")[i].style.opacity =  0.5;
        document.getElementsByClassName("tamhil-item")[i].style.opacity =  0.5;
    }
    let num = calcId.slice(-1);
    document.getElementsByClassName("tamhil-name")[num - 1].classList.add("active");
    document.getElementsByClassName("tamhil-name")[num - 1].style.opacity = 1;
    document.getElementsByClassName("tamhil-item")[num - 1].style.opacity = 1;


    $("#calc-total-t1").css("display", "none");
    $("#calc-total-t2").css("display", "none");
    $("#calc-total-t3").css("display", "none");
    $("#calc-total-t4").css("display", "none");
    $('#calc-total-' + calcId).css("display", "block");
}



let helpText = {
    "text1": "הזינו את סכום ההלוואה במסלול שבחרתם",
    "text2": "הזינו את תקופת ההלוואה ",
    "text3": "הזינו את תקופת הגרייס במידת וישנה",
    "text4": "ניתן לבחור מסלול הלוואה מהרשימה לפי תקופה והמחשבון ייתן לכם אינדיקציה לריבית אותה ניתן לקבל",
    "text5": "יש לבחור את צרות ההחזר - שפיצר, קרן שווה, או גרייס - תשלום ריבית בלבד",
    "text6": "ניתן להזין ריבית שנתית שונה מהמוצג",
    "text7": "ניתן להזין הצמדה שנתית במדד בשונה ממה שמוצג"
};

function createPaths(){
    // let arr1 = JSON.parse(document.getElementById("arr1").value);
    // let arr2 = JSON.parse(document.getElementById("arr2").value);
    // let currentMadad = parseFloat(document.getElementById("currentMadad").value);
    // let noMadadArr = [];
    // let MadadArr = [];
    // let index = 0;

    // for(const i of arr1){
    //     let check = {
    //         id: index, 
    //         name: i.title, 
    //         start: i.range_1_s, 
    //         end: i.range_3_e, 
    //         madad: 0
    //     }
    //     index++;
    //     noMadadArr.push(check);
    // }

    // for(const i of arr2){
    //     let check = {
    //         id: index, 
    //         name: i.title, 
    //         start: i.range_1_s, 
    //         end: i.range_3_e, 
    //         madad: currentMadad
    //     }
    //     index++;
    //     MadadArr.push(check);
    // }
    // let arr = noMadadArr.concat(MadadArr);

    // return arr;
    return maslulim;
}
var paths = [];

$(document).ready(function () {
    paths = createPaths();

    tamhilim[0] = new Tamhil(0, helpText, paths);
    tamhilim[1] = new Tamhil(1, helpText, paths);
    tamhilim[2] = new Tamhil(2, helpText, paths);
    tamhilim[3] = new Tamhil(3, helpText, paths);

    // tamhilim[0].drawTamhil();
    tamhilim.forEach(function (tamhil) {
        tamhil.drawTamhil(helpText, paths);
    });
});

let maslulim = [
    {
        "id": 0,
        "name": "מסלול פריים - משכנתא לדיור עד שליש מגובה ההלוואה",
        "start": "1.15",
        "end": "1.45",
        "madad": 0
    },
    {
        "id": 1,
        "name": "פריים - הלוואת משכנתא לדיור שני שליש מגובה ההלוואה",
        "start": "2.65",
        "end": "3.15",
        "madad": 0
    },
    {
        "id": 2,
        "name": "משכנתא על בסיס מק\"מ - משתנה כל שנה לא צמוד מדד",
        "start": "1.90",
        "end": "2.40",
        "madad": 0
    },
    {
        "id": 3,
        "name": "ריבית משתנה כל 5 לא צמודה למדד",
        "start": "4.05",
        "end": "4.65",
        "madad": 0
    },
    {
        "id": 4,
        "name": "קל\"צ 4 - 5 שנים",
        "start": "2.65",
        "end": "2.95",
        "madad": 0
    },
    {
        "id": 5,
        "name": "קל\"צ 6 - 7 שנים",
        "start": "2.80",
        "end": "3.25",
        "madad": 0
    },
    {
        "id": 6,
        "name": "קל\"צ 8 - 9 שנים",
        "start": "3.10",
        "end": "3.40",
        "madad": 0
    },
    {
        "id": 7,
        "name": "קל\"צ 10 - 11 שנים",
        "start": "3.30",
        "end": "3.65",
        "madad": 0
    },
    {
        "id": 8,
        "name": "קל\"צ 12 - 13 שנים",
        "start": "3.30",
        "end": "3.65",
        "madad": 0
    },
    {
        "id": 9,
        "name": "קל\"צ 14 - 15 שנים",
        "start": "3.45",
        "end": "3.75",
        "madad": 0
    },
    {
        "id": 10,
        "name": "קל\"צ 16 - 17 שנים",
        "start": "3.60",
        "end": "4.00",
        "madad": 0
    },
    {
        "id": 11,
        "name": "קל\"צ 18 - 19 שנים",
        "start": "3.80",
        "end": "4.15",
        "madad": 0
    },
    {
        "id": 12,
        "name": "קל\"צ 20 - 21 שנים",
        "start": "3.95",
        "end": "4.35",
        "madad": 0
    },
    {
        "id": 13,
        "name": "קל\"צ 22 - 23 שנים",
        "start": "4.10",
        "end": "4.50",
        "madad": 0
    },
    {
        "id": 14,
        "name": "קל\"צ 24 - 25 שנים",
        "start": "4.20",
        "end": "4.60",
        "madad": 0
    },
    {
        "id": 15,
        "name": "קל\"צ 26 - 27 שנים",
        "start": "4.20",
        "end": "4.70",
        "madad": 0
    },
    {
        "id": 16,
        "name": "קל\"צ 28 - 29 שנים",
        "start": "4.20",
        "end": "4.75",
        "madad": 0
    },
    {
        "id": 17,
        "name": "קל\"צ 30 שנים",
        "start": "4.30",
        "end": "4.75",
        "madad": 0
    },
    {
        "id": 18,
        "name": "ריבית משתנה כל 5 צמודה למדד",
        "start": "2.10",
        "end": "2.55",
        "madad": 2
    },
    {
        "id": 19,
        "name": "ריבית משתנה כל 2 צמודה למדד",
        "start": "1.85",
        "end": "2.20",
        "madad": 2
    },
    {
        "id": 20,
        "name": "ריבית משתנה כל 3 צמודה למדד",
        "start": "2.05",
        "end": "2.30",
        "madad": 2
    },
    {
        "id": 21,
        "name": "קצ\"מ 4 - 5 שנים",
        "start": "0.90",
        "end": "1.40",
        "madad": 2
    },
    {
        "id": 22,
        "name": "קצ\"מ 6 - 7 שנים",
        "start": "1.00",
        "end": "1.45",
        "madad": 2
    },
    {
        "id": 23,
        "name": "קצ\"מ 8 - 9 שנים",
        "start": "1.20",
        "end": "1.60",
        "madad": 2
    },
    {
        "id": 24,
        "name": "קצ\"מ 10 - 11 שנים",
        "start": "1.40",
        "end": "1.85",
        "madad": 2
    },
    {
        "id": 25,
        "name": "קצ\"מ 12 - 13 שנים",
        "start": "1.50",
        "end": "1.95",
        "madad": 2
    },
    {
        "id": 26,
        "name": "קצ\"מ 14 - 15 שנים",
        "start": "1.60",
        "end": "2.05",
        "madad": 2
    },
    {
        "id": 27,
        "name": "קצ\"מ 16 - 17 שנים",
        "start": "1.70",
        "end": "2.20",
        "madad": 2
    },
    {
        "id": 28,
        "name": "קצ\"מ 18 - 19 שנים",
        "start": "1.70",
        "end": "2.20",
        "madad": 2
    },
    {
        "id": 29,
        "name": "קצ\"מ 20 - 21 שנים",
        "start": "1.85",
        "end": "2.30",
        "madad": 2
    },
    {
        "id": 30,
        "name": "קצ\"מ 22 - 23 שנים",
        "start": "2.00",
        "end": "2.40",
        "madad": 2
    },
    {
        "id": 31,
        "name": "קצ\"מ 24 - 25 שנים",
        "start": "2.00",
        "end": "2.40",
        "madad": 2
    },
    {
        "id": 32,
        "name": "קצ\"מ 26 - 27 שנים",
        "start": "2.10",
        "end": "2.55",
        "madad": 2
    },
    {
        "id": 33,
        "name": "קצ\"מ 28 - 29 שנים",
        "start": "2.10",
        "end": "2.55",
        "madad": 2
    },
    {
        "id": 34,
        "name": "קצ\"מ 30 שנים",
        "start": "2.25",
        "end": "2.55",
        "madad": 2
    }
];

const CURRENT_MADAD = 2;
const CURRENT_INTEREST = 2.5;
