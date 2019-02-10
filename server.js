
var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var fs = require('fs');
var mysql = require('mysql');

var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "123456789",
    database: 'hackthon'
});




http.listen(3000,'0.0.0.0',function(){
    console.log("listing on 3000");
});

con.connect(function(err){
    if(err) throw err;
    console.log("db is connected");
});
var usercount=0;
io.on('connection',function(socket){
    usercount++;
    console.log(usercount,' user connected');

  
    socket.on('user_register',function(username,college,address,ph_number,email,field,password,profile_image){
            var values = {
                    'username':username,
                    'college':college,
                    'address':address,
                    'ph_number':ph_number,
                    'email': email,
                    'field': field,
                    'password':password,
                    'profile_image':profile_image
            };
                    console.log(values);
                con.query('insert into users_table set ? ',values,function(err,result){
                        if(err){
                            socket.emit('user_register_response','sorry');
                           // throw err;
                        } 
                        else{
                            socket.emit('user_register_response','registered');
                            console.log(result,'success');
                        }
                    
                });
            });
            
            socket.on('user_login',function(ph_number,password){
           
                        var sql='select password,userid from users_table where ph_number=?';
                    con.query(sql,ph_number,function(err,result){
                            if(err){
                                socket.emit('user_login_response','sorry');
                               console.log(err);
                            } 
                            else{
                                if (result.length>0){
                                    if (result[0].password==password){
                                                    socket.emit('user_login_response',result[0].userid);
                                    }
                                    else{
                                                    socket.emit('user_login_response',false);
                                    }
    
                               
                                console.log(result,'success');
                            }
                        }
                        
                    });
                });

      socket.on('insert_idea',function(creator_id,idea_text,idea_image_or_video,type_media,idea_time,idea_intrested_count,field){
       // var date = new  Date().toJSON().slice(0, 19).replace(/[-T]/g, ' :');
        //var str_date = date.toString();
        //console.log(date);
        var values = {
                'creator_id':creator_id,
                'idea_text':idea_text,
                'idea_image_or_video':idea_image_or_video,
                'type_media':type_media,
                'idea_time':idea_time,
                'idea_intrested_count':idea_intrested_count,
                'field':field
          };

          console.log(values);

        con.query('insert into ideas_table set ? ',values,function(err,result){
            if(err){
                socket.emit('insert_idea_response','sorry');
                throw err;
            } 
            else{
                socket.emit('insert_idea_response','idea registered');
                console.log(result,'success');
            }
        
    });      
      });      
   

      socket.on('retrive_idea',function(){
        // var date = new  Date().toJSON().slice(0, 19).replace(/[-T]/g, ' :');
         //var str_date = date.toString();
         //console.log(date);
         var values = {
            //values for class
           };
 
           console.log(values);
 
         con.query('select * from ideas_table ',function(err,result){
             if(err){
                 socket.emit('retrive_idea_response','sorry something went wrong');
                 throw err;
             } 
             else{
                 socket.emit('insert_idea_response',result);
                 console.log(result,'success');
             }
     }); 

     
       });








      socket.on('idea_discussion_insert',function(idea_id,comment_user_id,comment_text,comment_document,comment_document_type){
        var values = {
                'idea_id':idea_id,
                'comment_user_id': comment_user_id,
                'comment_text':comment_text,
                'comment_document':comment_document,
                'comment_document_type': comment_document_type
        };
                console.log(values);
            con.query('insert into idea_discussion_table set ? ',values,function(err,result){
                    if(err){
                        socket.emit('idea_discussion_insert_response',false);
                       // throw err;
                    } 
                    else{
                        socket.emit('idea_discussion_insert_response',true);
                        console.log(result,'success');
                    }
                
            });
        });

        socket.on('idea_discussion_retrive',function(){
            var values = {
                    //-----------
            };
                    console.log(values);
                con.query('select * from idea_discussion_table',values,function(err,result){
                        if(err){
                            socket.emit('idea_discussion_retrive_response',false);
                           // throw err;
                        } 
                        else{
                            socket.emit('idea_discussion_retrive_response',result);
                            console.log(result,'success');
                        }
                    
                });
            });




        socket.on('idea_intrested_people_insert',function(idea_id,user_id,leader_id){
            var values = {
                    'idea_id':idea_id,
                    'user_id':user_id,
                    'leader_id':leader_id
            };
                    console.log(values);
                con.query('insert into idea_intrested_people set ? ',values,function(err,result){
                        if(err){
                            socket.emit('idea_intrested_people_insert_response',false);
                           // throw err;
                        } 
                        else{
                            socket.emit('idea_intrested_people_insert_response',true);
                            console.log(result,'success');
                        }
                    
                });
            });

   socket.on('idea_intrested_people_retrive',function(){
            var values = {
                    //-----------
            };
                    console.log(values);
                con.query('select * from idea_intrested_people',function(err,result){
                        if(err){
                            socket.emit('idea_intrested_people_retrive_response',false);
                           // throw err;
                        } 
                        else{
                            socket.emit('idea_intrested_people_retrive_response',result);
                            console.log(result,'success');
                        }
                    
                });
            });


            socket.on(' join_request_leader_to_user_insert',function(project_id,leader_id,user_id,request_time,request_status){
                var values = {
                        'project_id':project_id,
                        'leader_id':leader_id,
                        'user_id' : user_id,
                        'request_time':request_time,
                        'request_status':request_status
                };
                        console.log(values);
                    con.query('insert into join_request_leader_to_user set ? ',values,function(err,result){
                            if(err){
                                socket.emit('join_request_leader_to_user_insert_response',false);
                               // throw err;
                            } 
                            else{
                                socket.emit('join_request_leader_to_user_insert_response',true);
                                console.log(result,'success');
                            }
                        
                    });
                });


                socket.on(' join_request_leader_to_user_retrive ',function(){
                    var values = {
                           //---------
                    };
                            console.log(values);
                        con.query('select * from  join_request_leader_to_use',function(err,result){
                                if(err){
                                    socket.emit('join_request_leader_to_user_insert_response',false);
                                   // throw err;
                                } 
                                else{
                                    socket.emit('join_request_leader_to_user_insert_response',result);
                                    console.log(result,'success');
                                }
                            
                        });
                    });






                socket.on('project_discussion_table_insert',function(project_id,comment_user_id,comment_text,comment_document,document_type){
                    var values = {
                            'project_id':project_id,
                            'comment_user_id': comment_user_id,
                            'comment_text':comment_text,
                            'comment_document':comment_document,
                            'document_type':document_type
                    };
                            console.log(values);
                        con.query('insert into project_discussion_table set ? ',values,function(err,result){
                                if(err){
                                    socket.emit('project_discussion_table_insert_response',false);
                                   // throw err;
                                } 
                                else{
                                    socket.emit('project_discussion_table_insert_response',true);
                                    console.log(result,'success');
                                }
                            
                        });
                    });


                    socket.on('project_discussion_table_retrive',function(){
                        var values = {
                               //------
                        };
                                console.log(values);
                            con.query('select * from  project_discussion_table  ',function(err,result){
                                    if(err){
                                        socket.emit('project_discussion_table_retrive_response',false);
                                       // throw err;
                                    } 
                                    else{
                                        socket.emit('project_discussion_table_retrive_response',result);
                                        console.log(result,'success');
                                    }
                                
                            });
                        });



                    socket.on('project_intrested_people_table_insert',function(project_id,user_id){
                        var values = {
                                'project_id':project_id,
                                    'user_id':user_id
                        };
                                console.log(values);
                            con.query('insert into project_intrested_people_table set ? ',values,function(err,result){
                                    if(err){
                                        socket.emit('project_intrested_people_table_insert_response',false);
                                       // throw err;
                                    } 
                                    else{
                                        socket.emit('project_intrested_people_table_insert_response',true);
                                        console.log(result,'success');
                                    }
                                
                            });
                        });    


                        socket.on('project_intrested_people_table_retrive',function(){
                            var values = {
                                    //------
                            };
                                    console.log(values);
                                con.query('select * from  project_intrested_people_table  ',function(err,result){
                                        if(err){
                                            socket.emit('project_intrested_people_table_retrive_response',false);
                                           // throw err;
                                        } 
                                        else{
                                            socket.emit('project_intrested_people_table_retrive_response',true);
                                            console.log(result,'success');
                                        }
                                    
                                });
                            });


                        socket.on('project_join_request_insert',function(project_id,leader_id,user_id,request_id,request_status){
                            var values = {
                                    'project_id':project_id,
                                    'leader_id':leader_id,
                                    'user_id': user_id,
                                    'request_id':request_id,
                                    'request_status':request_status
                            };
                                    console.log(values);
                                con.query('insert into project_join_request set ? ',values,function(err,result){
                                        if(err){
                                            socket.emit('project_join_request_insert_response',false);
                                           // throw err;
                                        } 
                                        else{
                                            socket.emit('project_join_request_insert_response',true);
                                            console.log(result,'success');
                                        }
                                    
                                });
                            }); 

                            socket.on('project_join_request_retrive',function(){
                                var values = {
                                      //---------
                                };
                                        console.log(values);
                                    con.query('select * from  project_join_request',function(err,result){
                                            if(err){
                                                socket.emit('project_join_request_retrive_response',false);
                                               // throw err;
                                            } 
                                            else{
                                                socket.emit('project_join_request_retrive_response',result);
                                                console.log(result,'success');
                                            }
                                        
                                    });
                                }); 



                            socket.on('project_scrum_table_insert',function(project_id,task,task_taker_user,task_status,task_type,task_created_time,user_type){
                                var values = {
                                        'project_id':project_id,
                                        'task':task,
                                        'task_taker_user':task_taker_user,
                                        'task_status':task_status,
                                        'task_type':task_type,
                                        'task_created_time':task_created_time,
                                        'user_type':user_type
                                };
                                        console.log(values);
                                    con.query('insert into project_scrum_table set ? ',values,function(err,result){
                                            if(err){
                                                socket.emit('project_scrum_table_insert_response',false);
                                               // throw err;
                                            } 
                                            else{
                                                socket.emit('project_scrum_table_insert_response',true);
                                                console.log(result,'success');
                                            }
                                        
                                    });
                                }); 

                                socket.on('project_scrum_table_retrive',function(project_id){
                                    
                                            console.log(values);
                                        con.query('select * from  project_scrum_table where project_id ='+mysql.escape(project_id),function(err,result){
                                                if(err){
                                                    socket.emit('project_scrum_table_insert_response',false);
                                                   // throw err;
                                                } 
                                                else{
                                                    socket.emit('project_scrum_table_insert_response',result);
                                                    console.log(result,'success');
                                                }
                                            
                                        });
                                    }); 

                                socket.on('project_team_chat_table_insert',function(project_id,user_id,message,document,document_type,chat_time){
                                    var values = {
                                            'project_id':project_id,
                                            'user_id':user_id,
                                            'message':message,
                                            'document':document,
                                            'document_type':document_type,
                                            'chat_time':chat_time
                                    };
                                            console.log(values);
                                        con.query('insert into project_team_chat_table set ? ',values,function(err,result){
                                                if(err){
                                                    socket.emit('project_team_chat_table_insert_response',false);
                                                   // throw err;
                                                } 
                                                else{
                                                    socket.emit('project_team_chat_table_insert_response',true);
                                                    console.log(result,'success');
                                                }
                                            
                                        });
                                    }); 



                                    socket.on('project_team_chat_table_retrive',function(project_id){
                                        var values = {
                                                //----
                                        };
                                                console.log(values);
                                            con.query('select * from  project_team_chat_table where project_id ='+mysql.escape(project_id),function(err,result){
                                                    if(err){
                                                        socket.emit('project_team_chat_table_retrive_response',false);
                                                       // throw err;
                                                    } 
                                                    else{
                                                        socket.emit('project_team_chat_table_retrive_response',result);
                                                        console.log(result,'success');
                                                    }
                                                
                                            });
                                        }); 



                                    socket.on('projects_table_insert',function(creator_id,project_text,project_document,project_doc_type,project_init_time,field){
                                        var values = {
                                                     'creator_id':creator_id,
                                                     'project_text':project_text,
                                                    'project_document':project_document,
                                                    'project_doc_type':project_doc_type,
                                                    'project_init_time':project_init_time,
                                                    'field':field
                                                    
                                        };
                                        console.log(values);
                                        con.query('insert into projects_table set ? ',values,function(err,result){
                                                if(err){
                                                    console.log(err);
                                                    socket.emit('projects_table_insert_response',false);
                                                   // throw err;
                                                } 
                                                else{
                                                    socket.emit('projects_table_insert_response',true);
                                                    console.log(result,'success');
                                                }
                                            
                                        });
                                    });

                                        socket.on('projects_table_retrive',function(){
                                            
                                            con.query('select username,profile_image from users_table  where userid in (select creator_id from projects_table)',function(err,result){
                                                    if(err){
                                                        socket.emit('projects_table_retrive_response',false);
                                                        console.log(err);
                                                    } 
                                                    else{
                                                       

                                                       // socket.emit('projects_table_retrive_response',result);
                                                                 console.log(result,'success');



                                                        con.query('select project_text,project_document,project_doc_type from projects_table',function(err,result1){
                                                            if(err){
                                                                socket.emit('projects_table_retrive_response',false);
                                                                console.log(err);
                                                            } 
                                                            else{

                                                               // socket.emit('projects_table_retrive_response',result);
                                                                console.log('------>res1',result1);                                                                
                                                                result['project_text']=result1.project_text;
                                                                result['project_document']=result1.project_document;
                                                                result['project_doc_type']=result1.project_doc_type;
                                                                console.log(result);
                                                                socket.emit('projects_table_retrive_response',result);
                                                            }
                                                           
                                                    }); 

                                                       
                                                        
                                                    }
                                                
                                            });

                                           

                                        }); 

                                        socket.on('projects_team_table_insert',function(project_id,team_id){
                                            var values = {
                                                          
                                                         'project_id':project_id,
                                                         'team_id':team_id
                                                        
                                            };
                                                    console.log(values);
                                                con.query('insert into projects_team_table set ? ',values,function(err,result){
                                                        if(err){
                                                            socket.emit('projects_team_table_insert_response',false);
                                                           // throw err;
                                                        } 
                                                        else{
                                                            socket.emit('projects_team_table_insert_response',true);
                                                            console.log(result,'success');
                                                        }
                                                    
                                                });
                                            }); 

                                            socket.on('projects_team_table_retrive',function(project_id,team_id){
                                                var values = {
                                                              
                                                             //-----
                                                            
                                                };
                                                        console.log(values);
                                                    con.query('select * from  projects_team_table where project_id =? and team_id = ?',[project_id,team_id],function(err,result){
                                                            if(err){
                                                                socket.emit('projects_team_table_retrive_response',false);
                                                               // throw err;
                                                            } 
                                                            else{
                                                                socket.emit('projects_team_table_retrive_response',result);
                                                                console.log(result,'success');
                                                            }
                                                        
                                                    });
                                                }); 

                                            socket.on('teams_table_insert',function(team_id,user_id,user_type){
                                                var values = {
                                                              
                                                             'team_id':team_id,
                                                             'user_id':user_id,
                                                             'user_type':user_type
                                                            
                                                };
                                                        console.log(values);
                                                    con.query('insert into teams_table set ? ',values,function(err,result){
                                                            if(err){
                                                                socket.emit('teams_table_insert_response',false);
                                                               // throw err;
                                                            } 
                                                            else{
                                                                socket.emit('teams_table_insert_response',true);
                                                                console.log(result,'success');
                                                            }
                                                        
                                                    });
                                                }); 


                                                socket.on('teams_table_retrive',function(team_id){
                                                    var values = {
                                                                  
                                                                //  'team_id':team_id,
                                                                //  'user_id':user_id,
                                                                //  'user_type':user_type
                                                                
                                                    };
                                                            console.log(values);
                                                        con.query('select * from  teams_table_retrive where team_id=? ',[team_id],values,function(err,result){
                                                                if(err){
                                                                    socket.emit('teams_table_retrive_response',false);
                                                                   // throw err;
                                                                } 
                                                                else{
                                                                    socket.emit('teams_table_retrive_response',result);
                                                                    console.log(result,'success');
                                                                }
                                                            
                                                        });
                                                    }); 
                                                socket.on('user_intrested_topic_insert',function(user_id,intrested_topic){
                                                    var values = {
                                                                  
                                                                
                                                                 'user_id':user_id,
                                                                 'intrested_topic':intrested_topic
                                                                
                                                    };
                                                            console.log(values);
                                                        con.query('insert into user_intrested_topic set ? ',values,function(err,result){
                                                                if(err){
                                                                    socket.emit('user_intrested_topic_insert_response',false);
                                                                   // throw err;
                                                                } 
                                                                else{
                                                                    socket.emit('user_intrested_topic_insert_response',true);
                                                                    console.log(result,'success');
                                                                }
                                                            
                                                        });
                                                    });


                                                    socket.on('user_intrested_topic_retrive',function(user_id,intrested_topic){
                                                        var values = {
                                                                      
                                                                    //doubt-------------------
                                                                     'user_id':user_id,
                                                                     'intrested_topic':intrested_topic
                                                                    
                                                        };
                                                                console.log(values);
                                                            con.query('select * from  user_intrested_topic where user_id=? ',values,function(err,result){
                                                                    if(err){
                                                                        socket.emit('user_intrested_topic_retrive_response',false);
                                                                       // throw err;
                                                                    } 
                                                                    else{
                                                                        socket.emit('user_intrested_topic_retrivet_response',true);
                                                                        console.log(result,'success');
                                                                    }
                                                                
                                                            });
                                                        });

    socket.on('disconnect',function(){
        usercount--;
        console.log(usercount,' user disconnected');
    });

});
