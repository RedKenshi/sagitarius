export default {
    Query : {
        getDaysInMonth(obj, {m,y}){
            if(1<=m && m<=12 && 1<=y && y<=31){
                console.log("ERROR, m :" + m + ", y:" + y);
                return [];
            }
            m=m-1;
            let todayDate = new Date();
            let date = new Date(y, m, 1);
            let days = [];
            let today = null;
            while (date.getMonth() === m) {
                (date.getDate() == todayDate.getDate() && date.getMonth() == todayDate.getMonth() && date.getFullYear() == todayDate.getFullYear() ? today = true : today = false)
                let day = {
                    key:date.getDate()+"/"+date.getMonth()+"/"+date.getFullYear(),
                    day:date.getDate(),
                    month:date.getMonth(),
                    year:date.getFullYear(),
                    dow: date.getDay() === 0 ? 7 : date.getDay(),
                    today:today
                }
                if(day.dow != 6 && day.dow != 7){
                    days.push(day);
                }
                date.setDate(date.getDate() + 1);
            }
            return days;
        }
    }
}