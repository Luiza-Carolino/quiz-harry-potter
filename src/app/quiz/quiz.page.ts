import { HttpClient } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-quiz',
  templateUrl: './quiz.page.html',
  styleUrls: ['./quiz.page.scss'],
})
export class QuizPage implements OnInit, OnDestroy {

  dados: any; // recebe os dados da api
  random: any[] = []; // recebe todas as alternativas
  respostaIndex: number = 0; // recebe o indice (posição) da resposta no array de alternativas
  acertos: number = 0; // conta a quantidade de acertos
  perguntas: number = 1; // conta em qual pergunta o usuário esta

  constructor(
    private httpclient:HttpClient,
    private alertController:AlertController,
    private router: Router
    ) {}

   async ngOnInit() {
    this.httpclient.get('https://hp-api.onrender.com/api/spells').subscribe(resultado => {this.dados = resultado; this.getrandom();});

  }

  getrandom(){
    this.respostaIndex = Math.floor(Math.random() * 5) 
    // gera um número entre 0 a 4 que será o indice da resposta { ex: 2 }

    for(let i = 0; i < 5; i++){ 
    // cria um loop de 0 a 4, sendo "i" o indice { 0 - 1 - 2 - 3 - 4 }

      if(i == this.respostaIndex) { 
      // se o indice do loop "i" for igual ao indice da resposta { ex: se i for igual a 2 }

        const randomIndex = Math.floor(Math.random() * this.dados.length ); 
        // gera um indice aleatório com base na quantidade de elementos na variavel "dados" (que recebeu todos os dados da api)
        // esse indice servirá pra pegar um dado aleatório
        // ex: [27]: { id: 'f8a783yd9839a', name: 'feitiço', description: 'esse feitiço faz isso' }

        this.random[this.respostaIndex] = this.dados[randomIndex]; 
        // atribui na variavel "random", no indice gerado da resposta (no caso 2), o dado selecionado aleatóriamente

      } else { 
        // se o indice "i" for diferente do indice da resposta, gera as outras alternativas incorretas

        const randomIndex = Math.floor(Math.random() * this.dados.length );
        // gera um indice aleatório com base na quantidade de elementos na variavel "dados" (que recebeu todos os dados da api)
        // esse indice servirá pra pegar um dado aleatório

        this.random[i] = this.dados[randomIndex].description;
        // atribui na variavel "random", no resto das posições, apenas a string da descrição do feitiço

      }
    }
    console.log(this.random)
  }

  async resposta(resposta: number){
    if(resposta === this.respostaIndex){
      this.acertos++;
    }
    else {

    }
    
    if(this.perguntas < 10){
      this.perguntas++;
      this.getrandom();
    }
    else{
      const alert = await this.alertController.create({
        header: 'Completed Quiz!',
        message: `you got it right ${this.acertos}/10`,
        buttons: [
          {
            text: "Back to start",
            handler: () => { this.router.navigateByUrl('/home') }
          }
        ],
      });
  
      await alert.present();
    }
  }

  ngOnDestroy() {
  this.dados = null;
  this.random = [];
  this.respostaIndex = 0;
  this.acertos = 0;
  this.perguntas = 1;  
  }
  
}
