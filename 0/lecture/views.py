# Create your views here.
from django.http import HttpResponse, Http404, HttpResponseRedirect
from django.template import RequestContext, loader
from django.shortcuts import render, get_object_or_404
# from django.core.urlresolvers import reverse
# from django.db.models import Avg
from django import db

from lecture.models import Course, Lecture, LectureComment, LectureCommentSuperRecord, LectureLevelRecord, LectureStudentScoreRecord
from login.models import User
from login.views import checkUserLogin

import os

def getLecture(request, lecture_id):
	db.close_connection()
	if request.method != 'GET': raise Http404
	print "123"
	user_id = checkUserLogin(request)				
	print lecture_id, type(lecture_id)
	lecture_id = int(lecture_id)
	user =  get_object_or_404(User, id=user_id)

	try:
		lecture = Lecture.objects.get(id=lecture_id)
	except Lecture.DoesNotExist:
		raise Http500

	lectures = lecture.course.lecture_set.all()

	template = loader.get_template('lecture/l.html')
	context = RequestContext(request, {
		'course': lecture.course,
		'lectures' : lectures,
		'u': user,
		'focus_lecture_id': lecture_id,
		})
	return HttpResponse(template.render(context))

def recordStudentScore(request, lecture_id):
	if request.method != "POST": raise Http404

	user_id = checkUserLogin(request)
	user = get_object_or_404(User, id=user_id)
	lecture_id = int(lecture_id)
	lecture = get_object_or_404(Lecture, id=lecture_id)
	try:
		LectureStudentScoreRecord.objects.filter(lecture=lecture, user=user)
		return HttpResponse("have recorded student score")
	except LectureStudentScoreRecord.DoesNotExist: pass
	lss = lecture.student_score         
	lssn = lecture.student_score_number
	newscore = float(lss*lssn + float(request.POST['score'])) / (lssn+1)
	lecture.student_score_number = lssn+1
	lecture.student_score = newscore
	lecture.save()

	LectureStudentScoreRecord.objects.create(lecture=lecture, user=user, score=float(request.POST['score']))

	return HttpResponse("yes")

def recordLevel(request, lecture_id):
	if request.method != "POST": raise Http404

	user_id = checkUserLogin(request)
	user = get_object_or_404(User, id=user_id)
	lecture_id = int(lecture_id)
	lecture = get_object_or_404(Lecture, id=lecture_id)
	try:
		LectureLevelRecord.objects.filter(lecture=lecture, user=user)
		return HttpResponse("have recorded student score")
	except LectureLevelRecord.DoesNotExist: pass
	ll = lecture.level         
	lln = lecture.level_number
	newlevel = float(ll*lln + float(request.POST['level'])) / (lln+1)
	lecture.level_number = lln+1
	lecture.level = newlevel
	lecture.save()

	LectureLevelRecord.objects.create(lecture=lecture, user=user, level=int(request.POST['level']))

	return HttpResponse("yes")	

def test(request, lecture_id):
	# user = get_object_or_404(User, id=14)
	# lecture_id = int(lecture_id)
	# lecture = get_object_or_404(Lecture, id=lecture_id)
	# content = "fuck SJTU"
	# lectureComment = LectureComment.objects.create(lecture=lecture, user=user, content=content)

	# return HttpResponse()

	if request.method != 'GET': raise Http404
	print "123"
	print lecture_id, type(lecture_id)
	lecture_id = int(lecture_id)

	try:
		lecture = Lecture.objects.get(id=lecture_id)
	except Lecture.DoesNotExist:
		raise Http500

	lectures = lecture.course.lecture_set.all()
	if 'SERVER_SOFTWARE' in os.environ:
		from bae.api import logging
		logging.debug("before for")
	lec = []
	for l in lectures: 
		tmp = {}
		tmp['lecture'] = l
		tmp['comments'] = LectureComment.objects.filter(lecture=l)
		lec.append(tmp)
	print lec	

	template = loader.get_template('lecture/test.html')
	context = RequestContext(request, {
		'course': lecture.course,
		'lectures': lectures,
		'focus_lecture_id': lecture_id,
		'lec': lec,
		})
	if 'SERVER_SOFTWARE' in os.environ:
		from bae.api import logging
		logging.debug("before return")
	return HttpResponse(template.render(context))