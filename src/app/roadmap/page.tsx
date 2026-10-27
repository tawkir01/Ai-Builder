"use client";

import { useEffect, useState } from 'react';
import styles from './page.module.css';
import FeatureNav from '@/components/FeatureNav';
import { 
  Lock, 
  Check, 
  BookOpen, 
  Code, 
  Award, 
  Sparkles,
  ChevronRight,
  X,
  ExternalLink,
  FileText,
  Save
} from 'lucide-react';

interface Task {
  title: string;
  description?: string;
  type: string;
}

interface WeekPlan {
  weekNumber: number;
  tasks: Task[];
}

interface TaskResourceInfo {
  howToLearn: string[];
  whereToLearn: { label: string; url: string }[];
}

import { getProfile, completeTask, UserProfile, saveTaskNote } from '@/lib/userProfile';

export default function RoadmapPage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [roadmap, setRoadmap] = useState<WeekPlan[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Modal States
  const [selectedTask, setSelectedTask] = useState<(Task & { taskId: string }) | null>(null);
  const [resources, setResources] = useState<TaskResourceInfo | null>(null);
  const [loadingResources, setLoadingResources] = useState(false);
  const [noteText, setNoteText] = useState('');
  const [isNoteSaved, setIsNoteSaved] = useState(false);

  useEffect(() => {
    async function loadRoadmap() {
      const userProfile = getProfile();
      setProfile(userProfile);
      
      try {
        const res = await fetch('/api/ai/roadmap', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ careerPath: userProfile.careerPath, level: userProfile.level })
        });
        const data = await res.json();
        if (data.roadmap && Array.isArray(data.roadmap)) {
          setRoadmap(data.roadmap);
        }
      } catch (err) {
        console.error("Failed to load roadmap:", err);
      } finally {
        setIsLoading(false);
      }
    }
    loadRoadmap();
  }, []);

  // Fetch Study Resources when Task is selected
  useEffect(() => {
    async function loadResources() {
      if (!selectedTask) return;
      
      // Load existing notes
      if (profile && profile.notes) {
        setNoteText(profile.notes[selectedTask.taskId] || '');
      } else {
        setNoteText('');
      }
      setIsNoteSaved(false);
      setResources(null);
      setLoadingResources(true);
      
      try {
        const res = await fetch('/api/ai/task-resources', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ taskTitle: selectedTask.title, taskDesc: selectedTask.description })
        });
        const data = await res.json();
        if (data.resources) {
          setResources(data.resources);
        }
      } catch (err) {
        console.error("Failed to load study resources:", err);
      } finally {
        setLoadingResources(false);
      }
    }
    loadResources();
  }, [selectedTask]);

  const handleSaveNote = () => {
    if (!selectedTask) return;
    const updated = saveTaskNote(selectedTask.taskId, noteText);
    setProfile(updated);
    setIsNoteSaved(true);
    setTimeout(() => setIsNoteSaved(false), 2000);
  };

  const toggleTask = (taskId: string, title: string, type: string) => {
    if (!profile) return;
    
    const skillPoints: { [key: string]: number } = {};
    const pathLower = (profile.careerPath || 'software').toLowerCase();
    
    // Classify primary skills based on career path
    let primarySkill = 'Software Engineering';
    if (pathLower.includes('frontend') || pathLower.includes('web') || pathLower.includes('ui')) {
      primarySkill = 'Frontend';
    } else if (pathLower.includes('backend') || pathLower.includes('api') || pathLower.includes('system')) {
      primarySkill = 'Backend';
    } else if (pathLower.includes('data') || pathLower.includes('machine') || pathLower.includes('ai')) {
      primarySkill = 'Data Science';
    } else if (pathLower.includes('design') || pathLower.includes('ux') || pathLower.includes('product')) {
      primarySkill = 'UI/UX Design';
    }
    
    skillPoints[primarySkill] = 15;
    
    // Supplemental skill mapping based on title keywords
    const titleLower = title.toLowerCase();
    if (titleLower.includes('react') || titleLower.includes('next.js') || titleLower.includes('css')) {
      skillPoints['Frontend'] = 10;
    }
    if (titleLower.includes('api') || titleLower.includes('node') || titleLower.includes('database')) {
      skillPoints['Backend'] = 10;
    }
    if (titleLower.includes('python') || titleLower.includes('model') || titleLower.includes('data')) {
      skillPoints['Data Science'] = 10;
    }
    if (titleLower.includes('figma') || titleLower.includes('design') || titleLower.includes('wireframe')) {
      skillPoints['UI/UX Design'] = 10;
    }

    const updated = completeTask(taskId, skillPoints);
    setProfile({ ...updated });
  };

  // Determine if a week is locked
  const isWeekLocked = (weekNumber: number) => {
    if (weekNumber === 1) return false;
    
    const prevWeek = roadmap.find(w => w.weekNumber === weekNumber - 1);
    if (!prevWeek) return false;
    
    // Check if ALL tasks of previous week are completed
    return !prevWeek.tasks.every((_, tIdx) => 
      profile?.completedTasks.includes(`w${weekNumber - 1}-t${tIdx}`)
    );
  };

  // Calculate completion percentage of a week
  const getWeekProgress = (week: WeekPlan) => {
    if (!profile) return 0;
    const completedCount = week.tasks.filter((_, tIdx) => 
      profile.completedTasks.includes(`w${week.weekNumber}-t${tIdx}`)
    ).length;
    return Math.round((completedCount / week.tasks.length) * 100);
  };

  // Helper to choose the right icon for task types
  const getTaskIcon = (type: string) => {
    switch (type.toUpperCase()) {
      case 'LEARN':
        return <BookOpen size={16} />;
      case 'BUILD':
        return <Code size={16} />;
      case 'APPLY':
        return <Award size={16} />;
      default:
        return <Sparkles size={16} />;
    }
  };

  return (
    <div className={styles.container}>
      <main className={styles.mainContent}>
        <FeatureNav />
        
        <header className={styles.header}>
          <div className={styles.headerLeft}>
            <h1>Interactive Skill Tree 🗺️</h1>
            <p>Goal: {profile?.careerPath || 'Software Engineer'}</p>
          </div>
          {profile && (
            <div className={styles.headerRight}>
              <div className={`glass ${styles.badge}`}>
                Level {profile.level} | {profile.experience} XP
              </div>
            </div>
          )}
        </header>

        <div className={styles.treeContainer}>
          <div className={styles.treeSpine}></div>

          {isLoading ? (
            <p className={styles.loader}>Generating your optimal learning path...</p>
          ) : roadmap.length === 0 ? (
            <p className={styles.loader}>Could not generate roadmap at this time. Please try again.</p>
          ) : (
            roadmap.map((week, wIdx) => {
              const locked = isWeekLocked(week.weekNumber);
              const progress = getWeekProgress(week);

              return (
                <div key={wIdx} className={styles.weekSection}>
                  {/* Week Title Node */}
                  <div className={styles.weekHeaderWrapper}>
                    <div className={styles.weekHeaderCard}>
                      <h2>Week {week.weekNumber}</h2>
                      {locked ? (
                        <span className={styles.weekLockedTag}>
                          <Lock size={12} /> Locked
                        </span>
                      ) : (
                        <span className={styles.weekProgress}>
                          {progress}% Done
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Tasks Nodes (Tree Branches) */}
                  <div className={styles.nodesGrid}>
                    {week.tasks.map((task, tIdx) => {
                      const taskId = `w${week.weekNumber}-t${tIdx}`;
                      const isDone = profile?.completedTasks.includes(taskId);
                      const isLeft = tIdx % 2 === 0;

                      return (
                        <div 
                          key={tIdx} 
                          className={isLeft ? styles.nodeWrapperLeft : styles.nodeWrapperRight}
                        >
                          <div 
                            className={`${styles.nodeCard} ${isDone ? styles.done : ''} ${locked ? styles.locked : ''}`}
                            onClick={() => !locked && setSelectedTask({ ...task, taskId })}
                            style={{ cursor: locked ? 'not-allowed' : 'pointer' }}
                          >
                            <div className={styles.nodeTop}>
                              <div className={styles.nodeIconWrapper}>
                                {getTaskIcon(task.type)}
                              </div>
                              <label 
                                className={`${styles.nodeCheckbox} ${locked ? styles.disabled : ''}`}
                                onClick={(e) => e.stopPropagation()}
                              >
                                <input 
                                  type="checkbox" 
                                  checked={isDone || false}
                                  disabled={locked}
                                  onChange={() => toggleTask(taskId, task.title, task.type)}
                                />
                                <span className={styles.checkboxReplica}>
                                  <Check size={12} strokeWidth={3} />
                                </span>
                              </label>
                            </div>

                            <div className={styles.nodeContent}>
                              <h3>{task.title}</h3>
                              {task.description && <p className={styles.nodeDesc}>{task.description}</p>}
                            </div>

                            <div className={styles.nodeMeta}>
                              <span className={`${styles.tag} ${
                                task.type.toUpperCase() === 'LEARN' ? styles.tagLearn : 
                                task.type.toUpperCase() === 'BUILD' ? styles.tagBuild : 
                                styles.tagApply
                              }`}>
                                {task.type}
                              </span>
                              <span className={styles.xpGain}>
                                +50 XP
                              </span>
                            </div>
                          </div>

                          {/* Branch Connector lines linking the node to the spine */}
                          <div className={isLeft ? styles.connectorLeft : styles.connectorRight}></div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </main>

      {/* Task Details & Study Guide Modal */}
      {selectedTask && (
        <div className={styles.modalOverlay} onClick={() => setSelectedTask(null)}>
          <div className={`glass ${styles.modalCard}`} onClick={(e) => e.stopPropagation()}>
            
            {/* Modal Header */}
            <div className={styles.modalHeader}>
              <div className={styles.modalHeaderLeft}>
                <h2>{selectedTask.title}</h2>
                <p>Task Type: {selectedTask.type} | ID: {selectedTask.taskId}</p>
              </div>
              <button className={styles.btnCloseModal} onClick={() => setSelectedTask(null)}>
                <X size={18} />
              </button>
            </div>

            {/* How to Learn (Steps) */}
            <div className={styles.studySection}>
              <h3>
                <BookOpen size={16} />
                How to Learn
              </h3>
              
              {loadingResources ? (
                <p style={{ fontSize: '0.85rem', color: 'var(--text-dim)' }}>Generating tutor study steps...</p>
              ) : resources?.howToLearn ? (
                <div className={styles.howSteps}>
                  {resources.howToLearn.map((step, idx) => (
                    <div key={idx} className={styles.stepItem}>
                      <span className={styles.stepNumber}>{idx + 1}</span>
                      <p>{step}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p style={{ fontSize: '0.85rem', color: 'var(--text-dim)' }}>Failed to load study steps.</p>
              )}
            </div>

            {/* Where to Learn (Links) */}
            <div className={styles.studySection}>
              <h3>
                <Sparkles size={16} />
                Where to Learn
              </h3>
              
              {loadingResources ? (
                <p style={{ fontSize: '0.85rem', color: 'var(--text-dim)' }}>Curating external learning tutorials...</p>
              ) : resources?.whereToLearn ? (
                <div className={styles.resourcesLinks}>
                  {resources.whereToLearn.map((link, idx) => (
                    <a 
                      key={idx} 
                      href={link.url} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className={styles.resourceLinkItem}
                    >
                      <span>{link.label}</span>
                      <ExternalLink size={14} />
                    </a>
                  ))}
                </div>
              ) : (
                <p style={{ fontSize: '0.85rem', color: 'var(--text-dim)' }}>Failed to load curated resources.</p>
              )}
            </div>

            {/* Your Study Notes */}
            <div className={styles.studySection}>
              <h3>
                <FileText size={16} />
                Your Study Notes
              </h3>
              <textarea 
                className={styles.notesArea}
                placeholder="Write your concepts, summaries, or questions here. Notes will auto-save to your local profile..."
                value={noteText}
                onChange={(e) => setNoteText(e.target.value)}
              />
              <button className={styles.btnSaveNote} onClick={handleSaveNote}>
                <Save size={14} />
                {isNoteSaved ? 'Saved!' : 'Save Note'}
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
