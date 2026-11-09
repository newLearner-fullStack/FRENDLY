from flask import Flask, render_template, request
from flask_socketio import SocketIO, emit
from flask_sqlalchemy import SQLAlchemy 
from datetime import datetime, timezone
from werkzeug.security import generate_password_hash, check_password_hash
import json



app = Flask(__name__)
socketio = SocketIO(
    app,
    cors_allowed_origins="*",
    async_mode="threading"
)

app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///test.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)


@app.route('/')
def home():
    return render_template('index.html')


class live(db.Model):
    __tablename__ = "live"
    
    id = db.Column(db.Integer, primary_key=True)
    
    userN = db.Column(db.String(100), unique=True)
    userCid = db.Column(db.String(100), unique=False)
    
class users(db.Model):
    __tablename__ = "users"
        
    id = db.Column(db.Integer, primary_key=True)
    
    userNm = db.Column(db.String(100), unique=True)
    userPw = db.Column(db.String(100), unique=True)
    # newMess = db.Column(db.String(1000), unique=False, nullable=True)


# {
#     from1:{
#         s0: message
#     }
#     from1:{
#             s0: message
#         }
# }

class unread(db.Model):
    __tablename__ = "unread"
        
    id = db.Column(db.Integer, primary_key=True)
    
    
    recNM = db.Column(db.String(100), unique=False)
    mess = db.Column(db.JSON, unique=False)


@socketio.on("login")
def verification(data):

    cd = json.loads(data)

    
    
    userl = live.query.filter_by(userN="hello").first()
    if userl:
        db.session.delete(userl)
        db.session.commit()
        print("hello delted")
    
    user = users.query.filter_by(
            userNm=cd["userID"]
        ).first()

    if user:

        if cd["password"] == user.userPw:
            print("verify")
            emit("verification", "verified")
            new = live(
                userN=cd["userID"],
                userCid=request.sid
            )
            db.session.add(new)
            db.session.commit()
            
            
            
            # print(live.query.all()+ "are live"+ request.sid)
        else:
            print("suspect")
            emit("verification", "suspect")

    else:
        print("Added"+request.sid)
        emit("verification", "added")
        
        new = live(
        userN=cd["userID"],
        userCid=request.sid
        )
        db.session.add(new)
        db.session.commit()

        ne = users(
            userNm=cd["userID"],
            userPw=cd["password"],
            # newMess=""
        )

        db.session.add(ne)
        db.session.commit()

    print(cd["userID"], cd["password"])    






@socketio.on("search")
def result(data):
    d = []
    nms = users.query.filter(users.userNm.contains(data)).all() or None
    if nms:
        for n in nms:
            d.append(n.userNm)
    else:
        None
    emit("results", d)
    print('emitted', d)
    




@socketio.on("connect")
def connected():
    print("connected", request.sid)


@socketio.on("disconnect")
def disconnected(reason=None):
    print("Client disconnected!", request.sid)
    user = live.query.filter_by(userCid=request.sid).first()
    if user:
        db.session.delete(user)
        db.session.commit()
        print("Removed:", user.userN)
    else:
        print("No matching live user found")



# mess = {
#     from1:{
#         s0: message
#     }
#     from1:{
#             s0: message
#         }
# # }






# @socketio.on("sendMes")
# def mUpdtr(data):
#     txt = data
#     print("called sendMEs")
#     user = unread.query.filter_by(recNM=txt["to"]).first()
    
    
    
#     if user:
        
        
#         oM = user.mess.copy()
#         sndr = oM.get(txt["from"], {}).copy()

#         cu = len(sndr)
#         sndr[f"s{cu}"] = txt["message"]

#         oM[txt["from"]] = sndr

#         user.mess = oM
#         db.session.commit()
        
#         print("messae updated",user.recNM, user.mess)
       
       
       
#     else:
        
#         med = {
#             txt["from"]:{
#                 "s0": txt["message"]
#             }
#         }
        
#         n = unread(
#             recNM = txt["to"],
#             mess = med
#         )
#         db.session.add(n)
#         db.session.commit()
        
#         print("messae added",n.recNM, n.mess)
        
#     socketio.emit("send_response", "solved")
        
        
        
    
    
    
    
    
    
    
@socketio.on("sendMes")
def mUpdtr(data):
    txt = data
    print("called sendMEs")

    # Check whether receiver is online
    # receiver = live.query.filter_by(userN=txt["to"]).first()

    # if receiver:
    #     # Receiver is online: send directly
    #     med = {
    #         txt["from"]: {
    #             "s0": txt["message"]
    #         }
    #     }

    #     emit(
    #         "unread",
    #         med,
    #         to=receiver.userCid
    #     )

    #     print("Message sent directly:", med)

    # else:
        # Receiver is offline: store message
    
    name = txt["to"]    
    
    l = live.query.filter_by(userN=name).first()   
    
    if l:
        mess = {
            "from": txt["from"],
            "messa": txt["message"]
        }
        print("live")
        emit("newM", mess, to=l.userCid)
        
    else:
        user = unread.query.filter_by(recNM=txt["to"]).first()

        if user:
            oM = (user.mess or {}).copy()
            sndr = oM.get(txt["from"], {}).copy()

            cu = len(sndr)
            sndr[f"s{cu}"] = txt["message"]

            oM[txt["from"]] = sndr

            user.mess = oM
            db.session.commit()

            print("Message updated", user.recNM, user.mess)

        else:
            med = {
                txt["from"]: {
                    "s0": txt["message"]
                }
            }

            n = unread(
                recNM=txt["to"],
                mess=med
            )

            db.session.add(n)
            db.session.commit()

            print("Message added", n.recNM, n.mess)

    emit("send_response", "solved")






@app.after_request
def bypass_tunnel(response):
    response.headers["bypass-tunnel-reminder"] = "true"
    return response




@socketio.on("ur")
def req(data):
    try:
        
        # rq = live.query.filter_by(userCid=me).first()
        
        nme = data
        
        print(nme + "trty1")
        print("data",data,nme)
        
        
        
        # med = {
        #     "txt":{
        #         "s0": "txt"
                
        #         },
        #     "nmko": {
        #         "s0": "tnkoxt",
        #         "s1": "koipou"
        #     }
        #     }
                
        # n = unread(
        #             recNM = "JKL",
        #             mess = med
        #         )
        # db.session.add(n)
        # db.session.commit()
        
        
        
        
        
        
        
        
        
        nm = unread.query.filter_by(recNM=nme).first()
        if nm:
            print(nm.mess, "trty3")
            
            emit("unread", nm.mess)
            db.session.delete()
            db.session.commit()
            print("send", nm.mess)
        else:
            print("No database row for:", nme)
    except:
        print("no message")

# results = users.query.filter(users.userNm.contains("ut")).all() or None
# print(results)

with app.app_context():
    db.drop_all()
    db.create_all()
     
     
    # k = users(
    #     userNm="utkarsh",
    #     userPw="u"
    # )
    # f = users(
    #     userNm="utk",
    #     userPw="utk"
    # )
    # db.session.add(k)
    # db.session.commit()
    # db.session.add(f)
    # db.session.commit()
    
    
    # h = {
    #                     "s0":"message",
    #                     "s1":"message"
    #                     }
    # up = (
    #     unread(
    #         recNM="utk",
    #         mess=json.dumps(h)
    #     )

    # )
    # db.session.add(up)
    # db.session.commit()



if __name__ == "__main__":
    socketio.run(
    app,
    host="0.0.0.0",
    port=5000,
    debug=True,
    use_reloader=False
)