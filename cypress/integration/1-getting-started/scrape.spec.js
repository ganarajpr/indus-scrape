/// <reference types="cypress" />
const start = 200;
const max = 600;
describe('download / scrape indus scripts', () => {
  let line = '';
  const header = 'ID,site,area,section,block,house,room,cisi,m77id,excavation,idno,reference,period,phase,boss,shape,depth,crossx,type,color,horizontal,vertical,thickness,horizontalmm,verticalmm,thicknessminmm,thicknessmaxmm,material,museum,textcondition,artefactpreservation,cult,symbol,notes,inscribedsides,stylegroup,class,lines,direction,signs,complete,alignment,signheight,images,text,keywords,symbol,symbolsubtype,animalfacing,cultobject,complete,images\n';
  beforeEach(() => {
    cy.visit({
      url: "https://www.indus.epigraphica.de/icitview.php",
      method: "POST",
      body: {
          idicit: ""+start,
      },
      auth: {
        username: 'icit',
        password: 'seal123',
      }
    });
  });

  it('downloads the data', () => {
    let data = [];
    const loop = Array.from({length: max});
    let cur = start;
    cy.wrap(loop)
      .each( () => {
        if(cur === max ) {
          return;                
        }
        cy.get('table').eq(1).get('tr').eq(1).get('td').each($el => {
          data.push($el.text());
        })
        .then(() => {
          line = line + data.join(',') + '\n';
          data = [];
          if(cur < max){ 
            cy.get('form')
            .last()
            .within($form => {
              cy.get('input')
              .first()
              .invoke('val')
              .then( newcur => {
                cur = +newcur > cur ? +newcur : max;
                cy.log(cur);
                if(cur % 100 === 0 || cur === max) {
                  cy.writeFile(`indus-${cur}.csv`, header+line, 'utf-8');
                  cy.log(cur);
                  line = '';
                }
                if(cur < max) {
                  cy.visit({
                    url: "https://www.indus.epigraphica.de/icitview.php",
                    method: "POST",
                    body: {
                        idicit: ""+cur,
                    },
                    auth: {
                      username: 'icit',
                      password: 'seal123',
                    }
                  });
                }
              });

            });
          }

          
        });
      });
      
    
  });
});
