import { Pipe, PipeTransform } from '@angular/core';

@Pipe({name:'customPipeGenreName'})
export class CustomPipe implements PipeTransform{
  
  transform(genreObjArray: any[]): string {
    let outputArray = [];
    genreObjArray.forEach((genreObj)=>{outputArray.push(genreObj.name)});
    return outputArray.toString().replace(/,/g, ", ");
  }

}