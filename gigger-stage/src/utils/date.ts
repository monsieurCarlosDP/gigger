const months = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
const weekDays = ['Domingo','Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sábado'];

export const convert2dateFormat = (event:Date):string => {    
    return `${weekDays[event.getUTCDay()]}, ${event.getDate()} de ${months[event.getMonth()]} de ${event.getFullYear()}`
}

export const convert2timeFormat = (time:string) => {
    if(!time)
        return '';
    
    const hms = time.split('.')[0];
    const hm = hms.split(':');
    return `${hm[0]}:${hm[1]}`
}